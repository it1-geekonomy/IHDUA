from __future__ import annotations

import time

from app.rag import answer_cache
from app.rag import constants as C
from app.rag.generate import generate_answer, recover_if_needed
from app.rag.intents import detect_intents, is_explicitly_off_topic, is_on_topic, match_fast_intent
from app.rag.links import clean_answer, valid_sources
from app.rag.memory import append_turn, get_history, resolve_session_id
from app.rag.normalize import normalize_for_retrieval
from app.rag.rerank import pick_sources, rerank
from app.rag.retrieve import hybrid_retrieve
from app.rag.rewrite import build_multi_queries, is_continuation, last_turn, rewrite_query
from app.rag.translate_query import has_kannada, to_english_search_query
from app.services import vector_store


def run_chat(
    message: str,
    session_id: str | None = None,
    client_history: list[dict] | None = None,
    language: str = "en",
) -> dict:
    result = _answer(
        message,
        session_id,
        client_history=client_history,
        language=language,
    )
    result["answer"] = clean_answer(result["answer"])
    result["sources"] = valid_sources(result.get("sources"))
    return result


def _answer(
    message: str,
    session_id: str | None,
    client_history: list[dict] | None = None,
    language: str = "en",
) -> dict:
    started = time.perf_counter()
    sid = resolve_session_id(session_id)
    user_message = (message or "").strip()
    lang = "kn" if (language or "en").lower() == "kn" else "en"
    fallback = C.localize(C.FALLBACK_ANSWER, lang)
    out_of_scope = C.localize(C.OUT_OF_SCOPE_ANSWER, lang)
    setup = C.localize(C.SETUP_ANSWER, lang)

    # 1. Fast intents (greeting, thank you, fast contact, fast donate)
    fast = match_fast_intent(user_message, language=lang)
    if fast:
        append_turn(sid, "user", user_message)
        append_turn(sid, "assistant", fast["answer"])
        return {
            "answer": fast["answer"],
            "sources": fast.get("sources") or [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 2. Nothing indexed yet: never answer from memory
    if vector_store.indexed_count() == 0:
        return {
            "answer": setup,
            "sources": [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 3. Check conversation history & answer cache
    if client_history:
        history = [
            {"role": h["role"], "content": h["content"]}
            for h in client_history
            if h.get("role") in ("user", "assistant") and h.get("content")
        ]
    else:
        history = get_history(sid)

    cacheable = not history
    index_ver = vector_store.index_version()
    cache_key = f"{lang}:{user_message}"
    if cacheable:
        cached = answer_cache.get(cache_key, current_version=index_ver)
        if cached:
            append_turn(sid, "user", user_message)
            append_turn(sid, "assistant", cached["answer"])
            return {
                **cached,
                "session_id": sid,
                "response_time_ms": int((time.perf_counter() - started) * 1000),
            }

    # 4. Normalize & rewrite query ("then" / "tell me more" continue the previous question)
    # Knowledge is English — Kannada questions are translated for retrieval only.
    question = search_source = user_message
    previous = last_turn(history, "user")
    if is_continuation(user_message) and previous and last_turn(history, "assistant") not in (
        C.FALLBACK_ANSWER,
        C.FALLBACK_ANSWER_KN,
        fallback,
    ):
        search_source = previous
        question = (
            f"Tell me more about: {previous}. Share details not already given in your previous answer; "
            "if there are none, say briefly that this is all IHDUA has published on it."
        )

    if lang == "kn" or has_kannada(search_source):
        search_source = to_english_search_query(search_source)

    search_text = normalize_for_retrieval(search_source)
    rewritten = rewrite_query(search_text, history, unanswered=fallback)
    intents = detect_intents(f"{search_text} {rewritten}")

    # Reject explicit off-topic queries immediately
    if is_explicitly_off_topic(user_message):
        append_turn(sid, "user", user_message)
        append_turn(sid, "assistant", out_of_scope)
        return {
            "answer": out_of_scope,
            "sources": [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 5. Multi-query retrieval
    queries = build_multi_queries(rewritten, intents, original=search_text)
    hits = hybrid_retrieve(queries, intents, question=search_text)
    # If a funding project title clearly matches the question, treat as donate intent
    if any(
        (h.get("table") == "funding_projects")
        and (h.get("title") or "").lower()
        and all(
            w in search_text.lower()
            for w in [
                t
                for t in (h.get("title") or "").lower().split()
                if len(t) >= 4
            ][:2]
        )
        for h in hits
    ):
        intents = set(intents) | {"donate"}
    # Named annual report → history intent so rerank prefers report docs
    q_lower = search_text.lower()
    if any(
        h.get("table") in ("annual_reports", "annual_reports_index") for h in hits
    ) and ("annual report" in q_lower or any(ch.isdigit() for ch in search_text)):
        intents = set(intents) | {"history"}
    ranked = vector_store.with_neighbor_chunks(rerank(hits, intents, question=search_text))

    # 6. Generate answer
    answer = generate_answer(question, ranked, history=history, language=lang)
    answer = recover_if_needed(clean_answer(answer) or C.NO_ANSWER_TOKEN, question, ranked, intents)
    answer = clean_answer(answer) or C.NO_ANSWER_TOKEN
    sources = pick_sources(ranked, intents, answer)

    if answer.strip() == C.NO_ANSWER_TOKEN or answer.strip() in (
        C.FALLBACK_ANSWER.strip(),
        C.FALLBACK_ANSWER_KN.strip(),
    ):
        answer = fallback
        sources = []
    elif answer.strip() in (
        C.OUT_OF_SCOPE_ANSWER.strip(),
        C.OUT_OF_SCOPE_ANSWER_KN.strip(),
    ):
        sources = []

    append_turn(sid, "user", user_message)
    append_turn(sid, "assistant", answer)
    if cacheable:
        answer_cache.put(cache_key, answer, sources, index_ver)

    return {
        "answer": answer,
        "sources": sources,
        "session_id": sid,
        "response_time_ms": int((time.perf_counter() - started) * 1000),
    }

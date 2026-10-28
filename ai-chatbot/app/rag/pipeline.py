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
from app.rag.rewrite import build_multi_queries, rewrite_query
from app.services import vector_store


def run_chat(message: str, session_id: str | None = None) -> dict:
    result = _answer(message, session_id)
    result["answer"] = clean_answer(result["answer"])
    result["sources"] = valid_sources(result.get("sources"))
    return result


def _answer(message: str, session_id: str | None) -> dict:
    started = time.perf_counter()
    sid = resolve_session_id(session_id)
    user_message = (message or "").strip()

    # 1. Fast intents (greeting, thank you, fast contact, fast donate)
    fast = match_fast_intent(user_message)
    if fast:
        append_turn(sid, "user", user_message)
        append_turn(sid, "assistant", fast["answer"])
        return {
            "answer": fast["answer"],
            "sources": fast.get("sources") or [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 2. Check if vector store is ready
    if vector_store.indexed_count() == 0:
        # If DB not indexed yet, attempt quick fallback search or static answers
        from app.services.corpus import _static_documents
        static_docs = _static_documents()
        for doc in static_docs:
            if any(w in user_message.lower() for w in doc["title"].lower().split()):
                ans = f"### {doc['title']}\n\n{doc['content']}"
                return {
                    "answer": ans,
                    "sources": [{"title": doc["title"], "url": doc["url"]}],
                    "session_id": sid,
                    "response_time_ms": int((time.perf_counter() - started) * 1000),
                }

        return {
            "answer": C.SETUP_ANSWER,
            "sources": [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 3. Check answer cache
    history = get_history(sid)
    cacheable = not history
    index_ver = vector_store.index_version()
    if cacheable:
        cached = answer_cache.get(user_message)
        if cached:
            append_turn(sid, "user", user_message)
            append_turn(sid, "assistant", cached["answer"])
            return {
                **cached,
                "session_id": sid,
                "response_time_ms": int((time.perf_counter() - started) * 1000),
            }

    # 4. Normalize & rewrite query
    search_text = normalize_for_retrieval(user_message)
    rewritten = rewrite_query(search_text, history)
    intents = detect_intents(f"{search_text} {rewritten}")

    # Reject explicit off-topic queries immediately
    if is_explicitly_off_topic(user_message):
        append_turn(sid, "user", user_message)
        append_turn(sid, "assistant", C.OUT_OF_SCOPE_ANSWER)
        return {
            "answer": C.OUT_OF_SCOPE_ANSWER,
            "sources": [],
            "session_id": sid,
            "response_time_ms": int((time.perf_counter() - started) * 1000),
        }

    # 5. Multi-query retrieval
    queries = build_multi_queries(rewritten, intents)
    hits = hybrid_retrieve(queries, intents, question=search_text)
    ranked = vector_store.with_neighbor_chunks(rerank(hits, intents))

    # 6. Generate answer
    answer = generate_answer(user_message, ranked)
    answer = recover_if_needed(clean_answer(answer) or C.NO_ANSWER_TOKEN, user_message, ranked, intents)
    answer = clean_answer(answer) or C.NO_ANSWER_TOKEN
    sources = pick_sources(ranked, intents, answer)

    if answer.strip() == C.NO_ANSWER_TOKEN or answer.strip() == C.FALLBACK_ANSWER.strip():
        answer = C.FALLBACK_ANSWER if bool(ranked) else C.OUT_OF_SCOPE_ANSWER
        sources = []
    elif answer.strip() == C.OUT_OF_SCOPE_ANSWER.strip():
        sources = []

    append_turn(sid, "user", user_message)
    append_turn(sid, "assistant", answer)
    if cacheable:
        answer_cache.put(user_message, answer, sources, index_ver)

    return {
        "answer": answer,
        "sources": sources,
        "session_id": sid,
        "response_time_ms": int((time.perf_counter() - started) * 1000),
    }

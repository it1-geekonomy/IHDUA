from __future__ import annotations

from app.config import settings
from app.rag import constants as C


def rerank(hits: list[dict], intents: set[str]) -> list[dict]:
    if not hits:
        return []

    scored = []
    for h in hits:
        base_sim = float(h.get("similarity", 0.0))
        bonus = 0.0

        title = (h.get("title") or "").lower()
        content = (h.get("content") or "").lower()

        # Intent tie-breaking bonus (gentle 0.06, never overwhelms true semantic similarity)
        if "education" in intents and any(k in title or k in content for k in ("school", "vidyashale", "adarsha")):
            bonus += 0.06
        if "women" in intents and any(k in title or k in content for k in ("shg", "women", "federation")):
            bonus += 0.06
        if "farmers" in intents and any(k in title or k in content for k in ("farmer", "agriculture", "crop", "irrigation", "fodder")):
            bonus += 0.06
        if "stitching" in intents and any(k in title or k in content for k in ("stitching", "garment", "tailor")):
            bonus += 0.06
        if "skills" in intents and any(k in title or k in content for k in ("gda", "nursing", "computer", "youth", "skills", "vocational", "trainee")):
            bonus += 0.06
        if "governance" in intents and any(k in title or k in content for k in ("12a", "80g", "fcra", "urn", "trust deed", "certificate", "charitable")):
            bonus += 0.06
        if "donate" in intents and any(k in title or k in content for k in ("donate", "80g", "tax", "contribution")):
            bonus += 0.06
        if "health" in intents and any(k in title or k in content for k in ("health", "camp", "medical")):
            bonus += 0.06
        if "contact" in intents and any(k in title or k in content for k in ("contact", "office", "address", "mysore")):
            bonus += 0.06
        if "leadership" in intents and any(k in title or k in content for k in ("leadership", "founder", "chairperson", "trustee", "board", "team")):
            bonus += 0.06
        if "impact" in intents and any(k in title for k in ("impact", "numbers", "statistics")):
            bonus += 0.06
        if "history" in intents and any(k in title for k in ("milestone", "history", "annual report")):
            bonus += 0.06
        if "stories" in intents and h.get("table") == "blogs":
            bonus += 0.06
        if "model_village" in intents and any(k in title or k in content for k in ("village", "green cover", "solar", "rejuvenation", "sanitation")):
            bonus += 0.06

        scored.append((base_sim + bonus, h))

    scored.sort(key=lambda x: x[0], reverse=True)

    # Filter strictly by similarity threshold
    threshold = settings.similarity_threshold
    top_hits = [h for s, h in scored if s >= threshold]

    return top_hits[:settings.retrieval_top_k]


def pick_sources(contexts: list[dict], intents: set[str], answer: str) -> list[dict]:
    if not contexts:
        return []

    # If the answer is an explicit fallback or refusal, do not display sources
    if not answer or answer in (C.NO_ANSWER_TOKEN, C.FALLBACK_ANSWER, C.OUT_OF_SCOPE_ANSWER):
        return []

    seen = set()
    sources = []
    for c in contexts:
        url = c.get("url") or "/"
        title = c.get("title") or C.PAGE_LABELS.get(url, "IHDUA")
        if url not in seen:
            seen.add(url)
            sources.append({"title": title, "url": url})
        if len(sources) >= settings.max_sources:
            break
    return sources

from __future__ import annotations

from app.config import settings
from app.services import vector_store


def hybrid_retrieve(
    queries: list[str],
    intents: set[str],
    question: str = "",
) -> list[dict]:
    all_hits: dict[str, dict] = {}

    search_results = vector_store.multi_search(
        queries,
        n_results=settings.retrieval_candidate_k,
    )

    for q, hits in search_results.items():
        for h in hits:
            cid = h["id"]
            if cid not in all_hits or h["similarity"] > all_hits[cid]["similarity"]:
                all_hits[cid] = h

    # Keyword / title boost
    keywords = []
    if "education" in intents:
        keywords.extend(["school", "vidyashale", "adarsha", "education"])
    if "women" in intents:
        keywords.extend(["women", "shg", "federation"])
    if "stitching" in intents:
        keywords.extend(["stitching", "tailoring", "garment"])
    if "donate" in intents:
        keywords.extend(["donate", "80g", "tax", "exemption"])
    if "health" in intents:
        keywords.extend(["health", "camp", "medical"])
    if "model_village" in intents:
        keywords.extend(["model village", "green cover", "rejuvenation"])
    if "contact" in intents:
        keywords.extend(["contact", "office", "mysore"])

    if keywords:
        kw_hits = vector_store.get_by_title_keywords(keywords)
        for kh in kw_hits:
            cid = kh["id"]
            if cid not in all_hits:
                all_hits[cid] = kh

    return list(all_hits.values())

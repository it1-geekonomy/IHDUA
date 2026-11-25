from __future__ import annotations

import re

from app.config import settings
from app.services import vector_store

_STOP = {
    "the",
    "and",
    "for",
    "what",
    "is",
    "are",
    "about",
    "explain",
    "tell",
    "me",
    "please",
    "with",
    "your",
    "how",
    "can",
    "find",
    "who",
    "where",
    "when",
    "does",
    "ihdua",
    "project",
    "projects",
    "funding",
    "donate",
    "donation",
}


def _question_tokens(question: str) -> list[str]:
    return [
        t.lower()
        for t in re.findall(r"[A-Za-z][A-Za-z0-9\-]{2,}", question or "")
        if t.lower() not in _STOP
    ]


def _title_overlap_score(title: str, question: str) -> float:
    q = (question or "").lower()
    words = [
        w
        for w in re.findall(r"[a-z]{3,}", (title or "").lower())
        if w not in _STOP
    ]
    if not words:
        return 0.0
    matched = sum(1 for w in words if w in q)
    return matched / len(words)


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
    if "skills" in intents:
        keywords.extend(["gda", "nursing", "computer", "youth", "skills", "vocational"])
    if "governance" in intents:
        keywords.extend(["12a", "80g", "fcra", "trust deed", "certificate", "documents"])
    if "donate" in intents:
        keywords.extend(
            [
                "donate",
                "80g",
                "tax",
                "exemption",
                "project",
                "funding",
                "breakup",
                "component",
                "essentials",
            ]
        )
    if "health" in intents:
        keywords.extend(["health", "camp", "medical"])
    if "model_village" in intents:
        keywords.extend(["model village", "green cover", "rejuvenation"])
    if "contact" in intents:
        keywords.extend(["contact"])
    if "volunteer" in intents:
        keywords.extend(["get involved", "volunteer", "rural residency", "partnership", "csr"])
    if "leadership" in intents:
        keywords.extend(["leadership"])
    if "impact" in intents:
        keywords.extend(["impact numbers"])
    if "history" in intents:
        keywords.extend(["milestones", "established", "founded", "founding"])
        # Only pull annual-report rows when the visitor actually asks about reports
        if "annual" in (question or "").lower():
            keywords.extend(["annual reports", "annual report"])

    # Always match significant question words against document titles
    # (fixes "explain about School Essentials" missing donate intent).
    keywords.extend(_question_tokens(question))

    if keywords:
        # de-dupe while preserving order
        keywords = list(dict.fromkeys(keywords))
        kw_hits = vector_store.get_by_title_keywords(keywords, limit=16)
        for kh in kw_hits:
            cid = kh["id"]
            overlap = _title_overlap_score(kh.get("title") or "", question)
            if kh.get("table") in ("funding_projects", "funding_projects_index") and overlap >= 0.5:
                kh = {**kh, "similarity": max(float(kh.get("similarity") or 0), 0.72 + 0.2 * overlap)}
            if (
                kh.get("table") in ("interactive_programmes", "interactive_programmes_index")
                and overlap >= 0.5
            ):
                kh = {**kh, "similarity": max(float(kh.get("similarity") or 0), 0.72 + 0.2 * overlap)}
            if kh.get("table") == "organizational_documents" and overlap >= 0.4:
                kh = {**kh, "similarity": max(float(kh.get("similarity") or 0), 0.74 + 0.2 * overlap)}
            if kh.get("table") in ("annual_reports", "annual_reports_index") and overlap >= 0.4:
                kh = {**kh, "similarity": max(float(kh.get("similarity") or 0), 0.74 + 0.2 * overlap)}
            if cid not in all_hits or kh["similarity"] > all_hits[cid]["similarity"]:
                all_hits[cid] = kh

    return list(all_hits.values())

from __future__ import annotations

import re

from app.config import settings
from app.rag import constants as C


def _title_in_question(title: str, question: str) -> bool:
    q = (question or "").lower()
    words = [w for w in re.findall(r"[a-z]{4,}", (title or "").lower())]
    if not words:
        return False
    return sum(1 for w in words if w in q) >= max(1, (len(words) + 1) // 2)


def rerank(hits: list[dict], intents: set[str], question: str = "") -> list[dict]:
    if not hits:
        return []

    scored = []
    for h in hits:
        base_sim = float(h.get("similarity", 0.0))
        bonus = 0.0

        title = (h.get("title") or "").lower()
        content = (h.get("content") or "").lower()
        table = h.get("table") or ""

        # Prefer CMS funding projects when the visitor names that project
        if table in ("funding_projects", "funding_projects_index"):
            bonus += 0.05
            if "donate" in intents:
                bonus += 0.06
            if question and _title_in_question(title, question):
                bonus += 0.16

        # Prefer CMS interactive programmes / events when named or event-related
        if table in ("interactive_programmes", "interactive_programmes_index"):
            bonus += 0.05
            if any(
                k in (question or "").lower()
                for k in ("event", "programme", "program", "camp", "workshop")
            ):
                bonus += 0.06
            if question and _title_in_question(title, question):
                bonus += 0.16

        # Intent tie-breaking bonus (gentle 0.06, never overwhelms true semantic similarity)
        if "education" in intents and any(k in title or k in content for k in ("school", "vidyashale", "adarsha")):
            # Don't let school initiative pages beat a named funding project
            if table == "funding_projects" and question and _title_in_question(title, question):
                bonus += 0.06
            elif table != "funding_projects":
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
        if table in ("annual_reports", "annual_reports_index"):
            bonus += 0.05
            if "history" in intents or "annual report" in (question or "").lower():
                bonus += 0.08
            if question and _title_in_question(title, question):
                bonus += 0.18
            # Year mention e.g. "2018" in "Annual Report 2018"
            year_hits = re.findall(r"\b(19|20)\d{2}\b", question or "")
            if year_hits and any(y in title for y in year_hits):
                bonus += 0.2
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

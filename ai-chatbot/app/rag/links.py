from __future__ import annotations

import re
from app.rag import constants as C

_MD_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")


def public_url(url: str | None) -> str:
    if not url:
        return "/"
    return url.strip()


def page_label(url: str, title: str = "") -> str:
    return C.PAGE_LABELS.get(url, title or "Learn More")


def clean_answer(answer: str) -> str:
    return answer.strip()


def valid_sources(sources: list[dict] | None) -> list[dict]:
    if not sources:
        return []
    seen = set()
    out = []
    for s in sources:
        u = s.get("url") or "/"
        t = s.get("title") or C.PAGE_LABELS.get(u, "IHDUA")
        if u not in seen:
            seen.add(u)
            out.append({"title": t, "url": u})
    return out[:C.max_sources if hasattr(C, "max_sources") else 3]

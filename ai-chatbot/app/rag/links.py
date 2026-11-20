from __future__ import annotations

import re
from app.rag import constants as C

_MD_LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
_ABS_SITE_RE = re.compile(
    r"https?://(?:www\.)?ihdua\.org(/[^\s)\]\"]*)?",
    re.IGNORECASE,
)

# Stub / placeholder frontend routes that must not be offered to visitors.
_STUB_URL_REWRITES = {
    "/getinvolved": "/#get-involved",
    "/get-involved": "/#get-involved",
    "/ourwork": "/",
    "/whyidhua": "/about",
}


def _normalize_path(url: str) -> str:
    raw = (url or "").strip()
    if not raw:
        return "/"
    path = raw
    for prefix in (
        "https://ihdua.org",
        "http://ihdua.org",
        "https://www.ihdua.org",
        "http://www.ihdua.org",
    ):
        if path.lower().startswith(prefix):
            path = path[len(prefix) :] or "/"
            break
    return path


def public_url(url: str | None) -> str:
    if not url:
        return "/"
    path = _normalize_path(url)
    base = path.split("?", 1)[0]
    # Compare stub keys without hash fragment on the left side
    path_only = base.split("#", 1)[0].rstrip("/") or "/"
    rewrite = _STUB_URL_REWRITES.get(path_only.lower())
    if rewrite:
        return rewrite
    return path


def page_label(url: str, title: str = "") -> str:
    return C.PAGE_LABELS.get(url, title or "Learn More")


def clean_answer(answer: str) -> str:
    text = (answer or "").strip()

    def _rewrite_md(match: re.Match[str]) -> str:
        label, href = match.group(1), match.group(2)
        new_href = public_url(href)
        old_path = _normalize_path(href).split("?", 1)[0].split("#", 1)[0].rstrip("/").lower() or "/"
        if old_path in ("/getinvolved", "/get-involved"):
            label = "Get Involved"
        return f"[{label}]({new_href})"

    text = _MD_LINK_RE.sub(_rewrite_md, text)

    def _rewrite_abs(match: re.Match[str]) -> str:
        path = match.group(1) or "/"
        return public_url(path)

    text = _ABS_SITE_RE.sub(_rewrite_abs, text)

    for stub, dest in _STUB_URL_REWRITES.items():
        text = re.sub(rf"(?<![(\w]){re.escape(stub)}\b", dest, text, flags=re.IGNORECASE)

    return text.strip()


def valid_sources(sources: list[dict] | None) -> list[dict]:
    if not sources:
        return []
    seen = set()
    out = []
    for s in sources:
        u = public_url(s.get("url") or "/")
        t = s.get("title") or C.PAGE_LABELS.get(u, "IHDUA")
        if u.rstrip("/").lower() in ("/getinvolved", "/get-involved"):
            continue
        if u not in seen:
            seen.add(u)
            out.append({"title": t, "url": u})
    return out[: C.max_sources if hasattr(C, "max_sources") else 3]

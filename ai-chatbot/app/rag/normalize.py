from __future__ import annotations

import re

_REPLACEMENTS = {
    "idhua": "ihdua",
    "ihuda": "ihdua",
    "vinayak": "vinayaka",
    "vidyashala": "vidyashale",
    "vidhyashale": "vidyashale",
    "kr nagar": "krs",
    "adarsh": "adarsha",
    "stiching": "stitching",
    "micro finance": "microfinance",
    "selfhelp": "self help",
    "donations": "donation",
}


def normalize_for_retrieval(query: str) -> str:
    cleaned = re.sub(r"[^\w\s-]", " ", query.lower()).strip()
    words = cleaned.split()
    normalized = [_REPLACEMENTS.get(w, w) for w in words]
    return " ".join(normalized)

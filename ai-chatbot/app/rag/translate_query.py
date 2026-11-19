"""Translate non-English visitor questions into English search queries.

Knowledge chunks are indexed in English. Kannada (and other) questions must be
rewritten for retrieval; the model still answers in the visitor's language.
"""

from __future__ import annotations

import logging
import re

from app.services.embeddings import chat_complete

log = logging.getLogger(__name__)

_KANNADA_RE = re.compile(r"[\u0C80-\u0CFF]")


def has_kannada(text: str) -> bool:
    return bool(_KANNADA_RE.search(text or ""))


def to_english_search_query(query: str) -> str:
    """Return an English retrieval query. Pass-through when already Latin-script."""
    q = (query or "").strip()
    if not q or not has_kannada(q):
        return q

    try:
        translated = chat_complete(
            [
                {
                    "role": "system",
                    "content": (
                        "You convert IHDUA website visitor questions into short English "
                        "search queries for a knowledge base. Output ONLY the English "
                        "query, no quotes or explanation. Keep IHDUA proper nouns "
                        "(IHDUA, Mysore, Mandya, Adarsha, Vinayaka, 80G, FCRA)."
                    ),
                },
                {
                    "role": "user",
                    "content": q[:800],
                },
            ],
            temperature=0,
            max_tokens=120,
        ).strip()
        # Guard against model chatter
        if translated and len(translated) < 400 and not has_kannada(translated):
            return translated
    except Exception as e:
        log.warning("Kannada→English search rewrite failed: %s", e)

    return q

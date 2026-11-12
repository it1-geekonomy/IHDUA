from __future__ import annotations

import logging
from pathlib import Path
from app.config import settings

log = logging.getLogger(__name__)

# Verified reference files only (certificate facts, donation-flow behaviour).
# Everything else comes from the CMS database or the live website.
_KNOWLEDGE_PAGES = {
    "donations_80g_tax": ("/#donate", "Donation"),
    "legal_certifications_12a_80g_fcra": ("/about", "Governance"),
}


def load_knowledge_files() -> list[dict]:
    root = Path(settings.knowledge_dir)
    if not root.exists():
        return []

    docs: list[dict] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in {".txt", ".md"}:
            continue
        raw = path.read_text(encoding="utf-8", errors="ignore").strip()
        if not raw:
            continue
        url, category = _KNOWLEDGE_PAGES.get(path.stem.lower(), ("/about", "Knowledge"))
        title = path.stem.replace("_", " ").title()
        docs.append(
            {
                "table": "knowledge",
                "source_id": f"public/{path.name}",
                "title": title,
                "url": url,
                "category": category,
                "content": raw,
            }
        )
    return docs


def load_corpus_documents() -> list[dict]:
    return load_knowledge_files()


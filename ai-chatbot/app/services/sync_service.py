from __future__ import annotations

import logging
from app.services import corpus, site_pages, vector_store

log = logging.getLogger(__name__)

_CURATED_TABLES = {"static", "knowledge", "site"}


def prune_cms_table(table: str, keep_ids: list[str]) -> dict:
    if table in _CURATED_TABLES:
        return {"status": "skipped", "table": table, "chunks_deleted": 0}
    keep = {(table, str(i)) for i in keep_ids}
    deleted = vector_store.delete_stale({table}, keep)
    return {"status": "pruned", "table": table, "chunks_deleted": deleted}


def upsert_cms_event(event: dict) -> dict:
    action = event.get("action")
    table = event["table"]
    source_id = str(event["source_id"])

    if action == "delete":
        deleted = vector_store.delete_row(table, source_id)
        return {
            "status": "deleted",
            "table": table,
            "source_id": source_id,
            "chunks_deleted": deleted,
        }

    doc = {
        "table": table,
        "source_id": source_id,
        "content": event.get("content") or "",
        "title": event.get("title") or table,
        "url": event.get("url") or "/",
        "category": event.get("category") or "Page",
        "slug": event.get("slug") or "",
        "designation": event.get("designation") or "",
    }
    chunks = vector_store.upsert_document(doc)
    return {
        "status": "upserted",
        "table": table,
        "source_id": source_id,
        "chunks_stored": chunks,
    }


def full_sync(force: bool = False) -> dict:
    site_docs, site_failed = site_pages.load_site_pages()
    docs = corpus.load_corpus_documents() + site_docs
    fp = vector_store.compute_fingerprint(docs)
    current = vector_store.load_fingerprint()

    if not force and current == fp and vector_store.indexed_count() > 0:
        return {
            "status": "skipped",
            "reason": "fingerprint_unchanged",
            "fingerprint": fp,
            "indexed_chunks": vector_store.indexed_count(),
            "corpus_documents": len(docs),
            "site_pages_failed": site_failed,
        }

    for doc in docs:
        vector_store.upsert_document(doc, force=force)

    keep = {(d["table"], str(d["source_id"])) for d in docs}
    keep |= {("site", path) for path in site_failed}
    stale = vector_store.delete_stale(_CURATED_TABLES, keep)

    vector_store.save_fingerprint(fp)
    return {
        "status": "synced",
        "fingerprint": fp,
        "corpus_documents": len(docs),
        "site_pages_indexed": len(site_docs),
        "site_pages_failed": site_failed,
        "stale_chunks_deleted": stale,
        "indexed_chunks": vector_store.indexed_count(),
    }

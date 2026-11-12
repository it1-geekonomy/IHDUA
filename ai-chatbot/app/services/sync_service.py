from __future__ import annotations

import logging
from app.rag import answer_cache
from app.services import cms_source, corpus, site_pages, vector_store

log = logging.getLogger(__name__)

_CURATED_TABLES = {"knowledge", "site"}
# Hard-coded sources from earlier versions; purged on the next full sync.
_LEGACY_TABLES = {"static", "website_data"}
# A change to a parent row (rename, unpublish, delete) affects every child document.
_PARENT_TABLES = {"impact_categories": "impact_initiatives", "blog_categories": "blogs"}


def prune_cms_table(table: str, keep_ids: list[str]) -> dict:
    if table in _CURATED_TABLES:
        return {"status": "skipped", "table": table, "chunks_deleted": 0}
    keep = {(table, str(i)) for i in keep_ids}
    deleted = vector_store.delete_stale({table}, keep)
    if deleted > 0:
        answer_cache.clear()
    return {"status": "pruned", "table": table, "chunks_deleted": deleted}


def _apply_payload(event: dict) -> dict:
    """Fallback when the CMS tables can't be read: index what the backend sent."""
    table = event["table"]
    source_id = str(event["source_id"])
    if event.get("action") == "delete":
        deleted = vector_store.delete_row(table, source_id)
        return {"status": "deleted", "table": table, "source_id": source_id, "chunks_deleted": deleted}

    title = event.get("title") or table
    url = event.get("url") or "/"
    body = cms_source.plain_text(event.get("content"))
    doc = {
        "table": table,
        "source_id": source_id,
        "title": title,
        "url": url,
        "category": event.get("category") or "Page",
        "slug": event.get("slug") or "",
        "designation": event.get("designation") or "",
        "content": f"Title: {title}\nWebsite page: {url}\nSource: IHDUA CMS\n\n{body}" if body else "",
    }
    chunks = vector_store.upsert_document(doc)
    return {"status": "upserted", "table": table, "source_id": source_id, "chunks_stored": chunks}


def _apply_from_cms(table: str, source_id: str) -> dict:
    if cms_source.is_aggregate(table):
        docs = cms_source.load_table(table)
        chunks = sum(vector_store.upsert_document(d) for d in docs)
        keep = {(table, cms_source.AGGREGATE_ID)} if docs else set()
        deleted = vector_store.delete_stale({table}, keep)
        return {"status": "rebuilt", "table": table, "chunks_stored": chunks, "chunks_deleted": deleted}

    docs = cms_source.load_table(table, source_id)
    if docs:
        chunks = vector_store.upsert_document(docs[0])
        return {"status": "upserted", "table": table, "source_id": source_id, "chunks_stored": chunks}
    deleted = vector_store.delete_row(table, source_id)
    return {"status": "deleted", "table": table, "source_id": source_id, "chunks_deleted": deleted}


def _rebuild_table(table: str) -> dict:
    docs = cms_source.load_table(table)
    chunks = sum(vector_store.upsert_document(d) for d in docs)
    keep = {(d["table"], str(d["source_id"])) for d in docs}
    deleted = vector_store.delete_stale({table}, keep)
    return {"status": "rebuilt", "table": table, "chunks_stored": chunks, "chunks_deleted": deleted}


def upsert_cms_event(event: dict) -> dict:
    table = event["table"]
    source_id = str(event["source_id"])
    try:
        if table in _PARENT_TABLES:
            return _rebuild_table(_PARENT_TABLES[table])
        if table in cms_source.CMS_TABLES:
            try:
                return _apply_from_cms(table, source_id)
            except Exception as exc:
                log.warning("Could not read %s#%s from CMS, using event payload: %s", table, source_id, exc)
        return _apply_payload(event)
    finally:
        answer_cache.clear()


def full_sync(force: bool = False) -> dict:
    cms_docs = cms_source.load_cms_documents()
    site_docs, site_failed = site_pages.load_site_pages()
    docs = (cms_docs or []) + site_docs + corpus.load_knowledge_files()
    fp = vector_store.compute_fingerprint(docs)
    current = vector_store.load_fingerprint()

    if not force and current == fp and vector_store.indexed_count() > 0:
        return {
            "status": "skipped",
            "reason": "fingerprint_unchanged",
            "fingerprint": fp,
            "indexed_chunks": vector_store.indexed_count(),
            "documents": len(docs),
            "site_pages_failed": site_failed,
        }

    for doc in docs:
        vector_store.upsert_document(doc, force=force)

    tables = _CURATED_TABLES | _LEGACY_TABLES
    if cms_docs is not None:
        tables |= cms_source.CMS_TABLES
    keep = {(d["table"], str(d["source_id"])) for d in docs}
    keep |= {("site", path) for path in site_failed}
    stale = vector_store.delete_stale(tables, keep)

    vector_store.save_fingerprint(fp)
    answer_cache.clear()
    return {
        "status": "synced",
        "fingerprint": fp,
        "cms_documents": len(cms_docs) if cms_docs is not None else None,
        "site_pages_indexed": len(site_docs),
        "site_pages_failed": site_failed,
        "stale_chunks_deleted": stale,
        "indexed_chunks": vector_store.indexed_count(),
    }

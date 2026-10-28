from __future__ import annotations

import hashlib
import json
import logging
import re
from typing import Any

from sqlalchemy import func, text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import SessionLocal
from app.models.document_chunk import DocumentChunk, RagMeta
from app.services.chunker import split_text
from app.services.embeddings import embed_batch, embed_queries

log = logging.getLogger(__name__)


def _db() -> Session:
    return SessionLocal()


def compute_fingerprint(docs: list[dict]) -> str:
    hasher = hashlib.sha256()
    for d in sorted(docs, key=lambda x: (x.get("table", ""), str(x.get("source_id", "")))):
        hasher.update(d.get("table", "").encode("utf-8"))
        hasher.update(str(d.get("source_id", "")).encode("utf-8"))
        hasher.update((d.get("content") or "").encode("utf-8"))
        hasher.update((d.get("title") or "").encode("utf-8"))
        hasher.update((d.get("url") or "").encode("utf-8"))
    return hasher.hexdigest()


def load_fingerprint() -> str | None:
    db = _db()
    try:
        row = db.query(RagMeta).filter(RagMeta.key == "corpus_fingerprint").first()
        return row.value if row else None
    except Exception:
        return None
    finally:
        db.close()


def save_fingerprint(fp: str) -> None:
    db = _db()
    try:
        row = db.query(RagMeta).filter(RagMeta.key == "corpus_fingerprint").first()
        if row:
            row.value = fp
        else:
            db.add(RagMeta(key="corpus_fingerprint", value=fp))
        db.commit()
    except Exception as e:
        db.rollback()
        log.warning("Could not save fingerprint: %s", e)
    finally:
        db.close()


def indexed_count() -> int:
    db = _db()
    try:
        return db.query(func.count(DocumentChunk.id)).scalar() or 0
    except Exception:
        return 0
    finally:
        db.close()


def index_version() -> int:
    return indexed_count()


def delete_row(table: str, source_id: str) -> int:
    db = _db()
    try:
        count = (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.source_table == table,
                DocumentChunk.source_id == source_id,
            )
            .delete()
        )
        db.commit()
        return count
    finally:
        db.close()


def delete_stale(tables: set[str], keep: set[tuple[str, str]]) -> int:
    db = _db()
    try:
        rows = (
            db.query(DocumentChunk.id, DocumentChunk.source_table, DocumentChunk.source_id)
            .filter(DocumentChunk.source_table.in_(tables))
            .all()
        )
        drop_ids = [
            r[0]
            for r in rows
            if (r[1], str(r[2])) not in keep
        ]
        if not drop_ids:
            return 0
        deleted = (
            db.query(DocumentChunk)
            .filter(DocumentChunk.id.in_(drop_ids))
            .delete(synchronize_session=False)
        )
        db.commit()
        return deleted
    finally:
        db.close()


def upsert_document(doc: dict, force: bool = False) -> int:
    table = doc["table"]
    source_id = str(doc["source_id"])
    content = (doc.get("content") or "").strip()
    if not content:
        delete_row(table, source_id)
        return 0

    chunks = split_text(content)
    if not chunks:
        delete_row(table, source_id)
        return 0

    title = (doc.get("title") or "").strip()
    url = (doc.get("url") or "/").strip()
    category = (doc.get("category") or "Page").strip()
    slug = (doc.get("slug") or "").strip()
    designation = (doc.get("designation") or "").strip()

    db = _db()
    try:
        if not force:
            existing = (
                db.query(DocumentChunk.content)
                .filter(
                    DocumentChunk.source_table == table,
                    DocumentChunk.source_id == source_id,
                )
                .order_by(DocumentChunk.chunk_index)
                .all()
            )
            if [r[0] for r in existing] == chunks:
                return len(chunks)

        embeddings = embed_batch(chunks)

        db.query(DocumentChunk).filter(
            DocumentChunk.source_table == table,
            DocumentChunk.source_id == source_id,
        ).delete()

        for idx, (chunk_text, emb) in enumerate(zip(chunks, embeddings)):
            db.add(
                DocumentChunk(
                    source_table=table,
                    source_id=source_id,
                    content=chunk_text,
                    chunk_index=idx,
                    embedding=emb,
                    title=title,
                    url=url,
                    category=category,
                    slug=slug,
                    designation=designation,
                )
            )
        db.commit()
        return len(chunks)
    except Exception as e:
        db.rollback()
        log.error("Failed to upsert document %s#%s: %s", table, source_id, e)
        raise
    finally:
        db.close()


def search(
    query: str,
    n_results: int = 5,
    categories: list[str] | None = None,
    tables: list[str] | None = None,
) -> list[dict]:
    results = multi_search([query], n_results=n_results, categories=categories, tables=tables)
    return results.get(query, [])


def multi_search(
    queries: list[str],
    n_results: int = 5,
    categories: list[str] | None = None,
    tables: list[str] | None = None,
) -> dict[str, list[dict]]:
    cleaned = [q.strip() for q in queries if q.strip()]
    if not cleaned:
        return {}

    embeddings = embed_queries(cleaned)
    db = _db()
    try:
        out: dict[str, list[dict]] = {}
        for q_text, emb in zip(cleaned, embeddings):
            emb_str = "[" + ",".join(str(f) for f in emb) + "]"
            where_clauses = ["1=1"]
            params: dict[str, Any] = {"emb": emb_str, "limit": n_results}

            if categories:
                where_clauses.append("category = ANY(:categories)")
                params["categories"] = categories

            if tables:
                where_clauses.append("source_table = ANY(:tables)")
                params["tables"] = tables

            sql = f"""
                SELECT
                    id, content, title, url, category, source_table, source_id,
                    chunk_index, slug, designation,
                    1 - (embedding <=> :emb) AS similarity
                FROM document_chunks
                WHERE {' AND '.join(where_clauses)}
                ORDER BY embedding <=> :emb
                LIMIT :limit
            """
            rows = db.execute(text(sql), params).mappings().all()
            hits = []
            for r in rows:
                sim = float(r["similarity"])
                hits.append(
                    {
                        "id": str(r["id"]),
                        "content": r["content"],
                        "similarity": sim,
                        "title": r["title"] or "",
                        "url": r["url"] or "/",
                        "category": r["category"] or "",
                        "table": r["source_table"] or "",
                        "source_id": r["source_id"] or "",
                        "parent_source_id": f"{r['source_table']}#{r['source_id']}",
                        "designation": r["designation"] or "",
                        "slug": r["slug"] or "",
                        "chunk_index": r["chunk_index"],
                    }
                )
            out[q_text] = hits
        return out
    finally:
        db.close()


def with_neighbor_chunks(hits: list[dict]) -> list[dict]:
    """If a top hit is chunk 0 of a multi-chunk document, include chunk 1 for context."""
    if not hits:
        return []
    db = _db()
    try:
        expanded = []
        for h in hits:
            expanded.append(h)
            if h.get("chunk_index") == 0:
                nxt = (
                    db.query(DocumentChunk)
                    .filter(
                        DocumentChunk.source_table == h.get("table"),
                        DocumentChunk.source_id == h.get("source_id"),
                        DocumentChunk.chunk_index == 1,
                    )
                    .first()
                )
                if nxt:
                    expanded.append(
                        {
                            "id": str(nxt.id),
                            "content": nxt.content,
                            "similarity": h.get("similarity", 0.5) * 0.9,
                            "title": nxt.title,
                            "url": nxt.url,
                            "category": nxt.category,
                            "table": nxt.source_table,
                            "source_id": nxt.source_id,
                            "parent_source_id": f"{nxt.source_table}#{nxt.source_id}",
                            "chunk_index": 1,
                        }
                    )
        return expanded
    finally:
        db.close()


def get_by_title_keywords(keywords: list[str]) -> list[dict]:
    keys = [k.lower() for k in keywords if k]
    if not keys:
        return []

    db = _db()
    try:
        rows = db.query(DocumentChunk).all()
        hits: list[dict] = []
        seen_parents: set[str] = set()
        for row in rows:
            title = (row.title or "").lower()
            category = (row.category or "").lower()
            if not any(k in title or k in category for k in keys):
                continue
            parent = f"{row.source_table}#{row.source_id}"
            if parent in seen_parents:
                continue
            seen_parents.add(parent)
            hits.append(
                {
                    "id": str(row.id),
                    "content": row.content,
                    "similarity": 0.55,
                    "title": row.title or "",
                    "url": row.url or "/",
                    "category": row.category or "",
                    "table": row.source_table or "",
                    "source_id": row.source_id or "",
                    "parent_source_id": parent,
                    "designation": row.designation or "",
                    "slug": row.slug or "",
                    "chunk_index": row.chunk_index,
                }
            )
        return hits
    finally:
        db.close()

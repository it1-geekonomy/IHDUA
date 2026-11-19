"""Builds chatbot documents straight from the CMS tables (shared ihdua_db).

Only published, non-deleted rows are returned, so anything an admin creates,
edits, unpublishes or soft-deletes is reflected on the next sync.
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any, Callable

from sqlalchemy import text

from app.database import SessionLocal
from app.services.site_pages import html_to_text

log = logging.getLogger(__name__)

AGGREGATE_ID = "all"

_URL_RE = re.compile(r"^(https?:)?//|^/[\w\-./]*\.(svg|png|jpe?g|webp|gif|mp4|webm|pdf)$", re.I)
_COLOR_RE = re.compile(r"^#[0-9a-f]{3,8}$", re.I)
_SKIP_KEYS = {
    "id", "kind", "type", "variant", "layout", "iconBg", "color", "bg", "background",
    "image", "images", "poster", "iconUrl", "icon", "url", "videoUrl", "src", "href",
}


def _updated(row: dict) -> str:
    value = row.get("updated_at")
    return f"Last updated: {value:%d %B %Y}\n" if value else ""


def _header(title: str, category: str, url: str, row: dict | None = None) -> str:
    return (
        f"Title: {title}\nCategory: {category}\nWebsite page: {url}\n"
        f"Source: IHDUA CMS (official, admin-managed)\n{_updated(row or {})}\n"
    )


def plain_text(value: str | None) -> str:
    raw = (value or "").strip()
    if not raw:
        return ""
    return html_to_text(raw) if "<" in raw and ">" in raw else raw


def _is_text(value: str) -> bool:
    v = value.strip()
    return bool(v) and not _URL_RE.search(v) and not _COLOR_RE.match(v)


def flatten_content(node: Any) -> list[str]:
    """Turns page-builder JSON into readable lines, dropping media URLs and styling keys."""
    lines: list[str] = []
    if isinstance(node, dict):
        scalars: list[str] = []
        nested: list[Any] = []
        for key, value in node.items():
            if key in _SKIP_KEYS or key.lower().endswith(("url", "urls", "image", "images")):
                continue
            if isinstance(value, str):
                if _is_text(value):
                    scalars.append(plain_text(value))
            elif isinstance(value, (int, float)) and not isinstance(value, bool):
                scalars.append(str(value))
            elif isinstance(value, (dict, list)):
                nested.append(value)
        if scalars:
            lines.append(" — ".join(scalars))
        for value in nested:
            lines.extend(flatten_content(value))
    elif isinstance(node, list):
        for item in node:
            lines.extend(flatten_content(item))
    elif isinstance(node, str) and _is_text(node):
        lines.append(plain_text(node))
    return [ln for ln in lines if ln.strip()]


def _rows(sql: str, params: dict | None = None) -> list[dict]:
    db = SessionLocal()
    try:
        return [dict(r) for r in db.execute(text(sql), params or {}).mappings().all()]
    finally:
        db.close()


def _blog_doc(row: dict) -> dict:
    url = f"/blogs/{row['slug']}"
    category = row.get("category_name") or "Blog"
    parts = [_header(row["title"], f"Blog / Story ({category})", url, row)]
    if row.get("blog_date"):
        parts.append(f"Published on: {row['blog_date']:%d %B %Y}\n")
    if row.get("short_description"):
        parts.append(f"Summary: {plain_text(row['short_description'])}\n")
    parts.append(f"\n{plain_text(row.get('content'))}")
    return {
        "table": "blogs",
        "source_id": str(row["id"]),
        "title": row["title"],
        "url": url,
        "category": "Blog",
        "slug": row["slug"],
        "content": "".join(parts).strip(),
    }


def _initiative_doc(row: dict) -> dict:
    url = f"/{row['slug']}"
    content = row.get("content")
    if isinstance(content, str):
        try:
            content = json.loads(content)
        except ValueError:
            content = None
    body = [
        row.get("hero_title") or "",
        plain_text(row.get("hero_description")),
        plain_text(row.get("meta_description")),
        *flatten_content(content or {}),
    ]
    seen: set[str] = set()
    lines = [ln for ln in body if ln and not (ln in seen or seen.add(ln))]
    return {
        "table": "impact_initiatives",
        "source_id": str(row["id"]),
        "title": row["name"],
        "url": url,
        "category": row.get("category_name") or "Impact",
        "slug": row["slug"],
        "content": _header(row["name"], f"Impact programme ({row.get('category_name') or 'Impact'})", url, row)
        + "\n".join(lines),
    }


def _legal_doc(table: str, url: str) -> Callable[[dict], dict]:
    def build(row: dict) -> dict:
        return {
            "table": table,
            "source_id": str(row["id"]),
            "title": row["title"],
            "url": url,
            "category": "Legal",
            "content": _header(row["title"], "Legal", url, row) + plain_text(row.get("content")),
        }
    return build


def _latest(rows: list[dict]) -> dict:
    stamps = [r["updated_at"] for r in rows if r.get("updated_at")]
    return {"updated_at": max(stamps)} if stamps else {}


def _impact_stats_doc(rows: list[dict]) -> dict | None:
    if not rows:
        return None
    title = "IHDUA Impact Numbers"
    lines = [f"• {r['metric_name']}: {r['metric_value']}" for r in rows]
    return {
        "table": "impact_stats",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/",
        "category": "Impact",
        "content": _header(title, "Impact statistics", "/", _latest(rows))
        + "Current official impact statistics of IHDUA:\n" + "\n".join(lines),
    }


def _leadership_doc(rows: list[dict]) -> dict | None:
    if not rows:
        return None
    title = "IHDUA Leadership & Team"
    lines = [f"• {r['name']} — {r['designation']}" for r in rows]
    return {
        "table": "leadership_members",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/about",
        "category": "Leadership",
        "content": _header(title, "Leadership", "/about", _latest(rows))
        + "Leadership team, trustees and key members of IHDUA:\n" + "\n".join(lines),
    }


def _milestones_doc(rows: list[dict]) -> dict | None:
    if not rows:
        return None
    title = "IHDUA Milestones & History"
    lines = [f"• {r['year']}: {plain_text(r['description'])}" for r in rows]
    return {
        "table": "milestones",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/about",
        "category": "About",
        "content": _header(title, "History", "/about", _latest(rows))
        + "Key milestones in IHDUA's journey, by year:\n" + "\n".join(lines),
    }


def _annual_reports_doc(rows: list[dict]) -> dict | None:
    if not rows:
        return None
    title = "IHDUA Annual Reports"
    lines = [f"• {r['title']} ({r['report_year']})" for r in rows]
    return {
        "table": "annual_reports",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/about",
        "category": "Governance",
        "content": _header(title, "Governance", "/about", _latest(rows))
        + "Annual reports published by IHDUA, available to view and download on the About Us page:\n"
        + "\n".join(lines),
    }


def _documents_doc(rows: list[dict]) -> dict | None:
    if not rows:
        return None
    title = "IHDUA Organizational Documents"
    lines = [f"• {r['title']}" for r in rows]
    return {
        "table": "organizational_documents",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/about",
        "category": "Governance",
        "content": _header(title, "Governance", "/about", _latest(rows))
        + "Official organizational documents published by IHDUA, available to view on the About Us page:\n"
        + "\n".join(lines),
    }


def _parse_json_list(value: Any) -> list:
    if isinstance(value, list):
        return value
    if isinstance(value, str) and value.strip():
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except ValueError:
            return []
    return []


def _funding_project_doc(row: dict) -> dict:
    """One published funding project from the Donate page CMS."""
    title = row["title"]
    url = "/donate"
    parts = [
        _header(title, "Funding Project", url, row),
        "This is a published IHDUA funding project on the Donate page (/donate).\n",
        "Donors can support the full project or a specific component (line item).\n",
    ]
    if row.get("project_number"):
        parts.append(f"Project number: {row['project_number']}\n")
    if row.get("cause"):
        parts.append(f"Donation category / cause: {row['cause']}\n")
    if row.get("total_label"):
        parts.append(f"Total amount sought: {row['total_label']}\n")
    if row.get("summary"):
        parts.append(f"\nSummary:\n{plain_text(row['summary'])}\n")

    highlights = _parse_json_list(row.get("highlights"))
    if highlights:
        parts.append("\nHighlights:\n")
        for item in highlights:
            if isinstance(item, str) and item.strip():
                parts.append(f"• {item.strip()}\n")

    components = _parse_json_list(row.get("components"))
    if components:
        parts.append("\nComponent-wise funding breakup:\n")
        for item in components:
            if not isinstance(item, dict):
                continue
            name = str(item.get("name") or "").strip()
            amount = str(item.get("amountLabel") or item.get("amount_label") or "").strip()
            if name and amount:
                parts.append(f"• {name}: {amount}\n")
            elif name:
                parts.append(f"• {name}\n")

    parts.append(
        "\nTo donate to this project, open the Donate page at /donate, "
        "browse projects, and choose this project or one of its components.\n"
    )
    return {
        "table": "funding_projects",
        "source_id": str(row["id"]),
        "title": title,
        "url": url,
        "category": "Funding Project",
        "slug": row.get("slug") or "",
        "content": "".join(parts).strip(),
    }


def _funding_projects_index_doc(rows: list[dict]) -> dict | None:
    """Short index of all published funding projects for list-style questions."""
    if not rows:
        return None
    title = "IHDUA Funding Projects on Donate"
    lines = []
    for r in rows:
        label = r.get("total_label") or ""
        line = f"• {r['title']}"
        if label:
            line += f" — {label}"
        lines.append(line)
    return {
        "table": "funding_projects_index",
        "source_id": AGGREGATE_ID,
        "title": title,
        "url": "/donate",
        "category": "Funding Project",
        "content": _header(title, "Funding Project", "/donate", _latest(rows))
        + "Published funding projects currently seeking support on the Donate page (/donate). "
        "Project list is managed in the CMS and can change.\n"
        + "\n".join(lines)
        + "\n\nAsk about a project by name for its summary and component breakup, "
        "or visit /donate to browse and donate.",
    }


_PUBLISHED = "deleted_at IS NULL AND status = 'published'"

# Tables indexed one document per row: (query, id column, builder).
_ROW_TABLES: dict[str, tuple[str, str, Callable[[dict], dict]]] = {
    "blogs": (
        "SELECT b.id, b.title, b.slug, b.content, b.short_description, b.blog_date, b.updated_at, "
        "c.name AS category_name FROM blogs_and_stories b "
        "LEFT JOIN blog_categories c ON c.id = b.category_id AND c.deleted_at IS NULL "
        "WHERE b.deleted_at IS NULL AND b.status = 'published'",
        "b.id",
        _blog_doc,
    ),
    "impact_initiatives": (
        "SELECT i.id, i.name, i.slug, i.hero_title, i.hero_description, i.meta_description, "
        "i.content, i.updated_at, c.name AS category_name FROM impact_initiatives i "
        "JOIN impact_categories c ON c.id = i.category_id "
        "WHERE i.deleted_at IS NULL AND i.status = 'published' "
        "AND c.deleted_at IS NULL AND c.status = 'published'",
        "i.id",
        _initiative_doc,
    ),
    "privacy_policy": (
        f"SELECT id, title, content, updated_at FROM privacy_policy WHERE {_PUBLISHED}",
        "id",
        _legal_doc("privacy_policy", "/privacy-policy"),
    ),
    "terms_and_conditions": (
        f"SELECT id, title, content, updated_at FROM terms_and_conditions WHERE {_PUBLISHED}",
        "id",
        _legal_doc("terms_and_conditions", "/terms-and-conditions"),
    ),
    "funding_projects": (
        "SELECT id, slug, project_number, title, summary, total_label, cause, "
        "highlights, components, updated_at FROM funding_projects "
        f"WHERE {_PUBLISHED} ORDER BY sort_order, project_number, created_at",
        "id",
        _funding_project_doc,
    ),
}

# Small tables indexed as one combined document so "list all ..." questions get every row.
_AGGREGATE_TABLES: dict[str, tuple[str, Callable[[list[dict]], dict | None]]] = {
    "impact_stats": (
        "SELECT metric_name, metric_value, updated_at FROM impact_stats "
        "WHERE deleted_at IS NULL ORDER BY card_position, created_at",
        _impact_stats_doc,
    ),
    "leadership_members": (
        f"SELECT name, designation, updated_at FROM leadership_members WHERE {_PUBLISHED} "
        "ORDER BY sort_order, created_at",
        _leadership_doc,
    ),
    "milestones": (
        f"SELECT year, description, updated_at FROM milestones WHERE {_PUBLISHED} "
        "ORDER BY year, created_at",
        _milestones_doc,
    ),
    "annual_reports": (
        f"SELECT title, report_year, updated_at FROM annual_reports WHERE {_PUBLISHED} "
        "ORDER BY report_year DESC, sort_order",
        _annual_reports_doc,
    ),
    "organizational_documents": (
        f"SELECT title, updated_at FROM organizational_documents WHERE {_PUBLISHED} "
        "ORDER BY sort_order, created_at",
        _documents_doc,
    ),
    "funding_projects_index": (
        "SELECT title, total_label, updated_at FROM funding_projects "
        f"WHERE {_PUBLISHED} ORDER BY sort_order, project_number, created_at",
        _funding_projects_index_doc,
    ),
}

CMS_TABLES: frozenset[str] = frozenset(_ROW_TABLES) | frozenset(_AGGREGATE_TABLES)


def is_aggregate(table: str) -> bool:
    return table in _AGGREGATE_TABLES


def load_table(table: str, source_id: str | None = None) -> list[dict]:
    """Current published documents for one CMS table (optionally a single row). Raises on DB errors."""
    if table in _AGGREGATE_TABLES:
        sql, build = _AGGREGATE_TABLES[table]
        doc = build(_rows(sql))
        return [doc] if doc else []

    sql, id_column, build_row = _ROW_TABLES[table]
    params: dict = {}
    if source_id:
        sql = f"{sql} AND {id_column}::text = :sid"
        params["sid"] = source_id
    docs = []
    for row in _rows(sql, params):
        doc = build_row(row)
        if doc["content"].strip():
            docs.append(doc)
    return docs


def load_cms_documents() -> list[dict] | None:
    """All published CMS documents, or None when the CMS tables cannot be read."""
    docs: list[dict] = []
    try:
        for table in sorted(CMS_TABLES):
            docs.extend(load_table(table))
    except Exception as exc:
        log.warning("CMS tables unavailable, keeping previously synced CMS content: %s", exc)
        return None
    return docs

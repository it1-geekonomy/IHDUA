from __future__ import annotations

import logging
import re
import urllib.request
from html.parser import HTMLParser

from app.config import settings

log = logging.getLogger(__name__)

# Website routes still rendered from frontend code. Routes that render CMS content
# (impact initiative pages, /impact, blogs, legal pages) are indexed from the
# database by cms_source instead, so unpublished pages never reach the bot.
SITE_PAGES = [
    "/",
    "/about",
    "/education",
    "/health",
    "/model-village",
    "/skills-and-employment",
    "/getinvolved",
    "/contact",
]

PAGE_LABELS = {
    "/": "Home",
    "/about": "About Us",
    "/education": "Education Programs",
    "/health": "Health & Well-being",
    "/model-village": "Model Village",
    "/skills-and-employment": "Skills & Employment",
    "/getinvolved": "Get Involved",
    "/contact": "Contact Us",
}

_SKIP_TAGS = {
    "script", "style", "noscript", "svg", "template", "head",
    "nav", "header", "footer", "dialog",
}
_BLOCK_TAGS = {
    "p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "div", "section",
    "article", "br", "tr", "td", "th", "blockquote",
}


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._skip_tag: str | None = None
        self._skip_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if self._skip_tag:
            if tag == self._skip_tag:
                self._skip_depth += 1
            return
        if tag in _SKIP_TAGS:
            self._skip_tag, self._skip_depth = tag, 1
            return
        if tag in _BLOCK_TAGS:
            self.parts.append("\n")

    def handle_endtag(self, tag):
        if self._skip_tag:
            if tag == self._skip_tag:
                self._skip_depth -= 1
                if self._skip_depth == 0:
                    self._skip_tag = None
            return
        if tag in _BLOCK_TAGS:
            self.parts.append("\n")

    def handle_data(self, data):
        if not self._skip_tag:
            self.parts.append(data)


def html_to_text(html: str) -> str:
    parser = _TextExtractor()
    parser.feed(html)
    text = re.sub(r"[ \t\u00a0]+", " ", "".join(parser.parts))
    lines: list[str] = []
    seen: set[str] = set()
    for line in (ln.strip() for ln in text.splitlines()):
        if len(line) < 3 or line in seen:
            continue
        seen.add(line)
        lines.append(line)
    return "\n".join(lines)


def _fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "IHDUA-Chatbot-Indexer"})
    with urllib.request.urlopen(req, timeout=15) as res:
        return res.read().decode("utf-8", errors="ignore")


def load_site_pages() -> tuple[list[dict], list[str]]:
    base = (settings.site_crawl_url or "").rstrip("/")
    if not base:
        return [], []

    docs: list[dict] = []
    failed: list[str] = []
    for path in SITE_PAGES:
        try:
            text = html_to_text(_fetch(base + path))
        except Exception as exc:
            # Skip pages that are not currently published in the CMS
            log.debug("Skipping unrendered page %s%s: %s", base, path, exc)
            failed.append(path)
            continue
        if len(text) < 60:
            failed.append(path)
            continue
        title = PAGE_LABELS.get(path, path)
        docs.append(
            {
                "table": "site",
                "source_id": path,
                "title": title,
                "url": path,
                "category": "Page",
                "content": (
                    f"Title: {title}\nCategory: Page\nWebsite page: {path}\n"
                    f"Source: live IHDUA website page\n\n{text}"
                ),
            }
        )
    return docs, failed

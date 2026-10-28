from __future__ import annotations

import logging
import re
import urllib.request
from html.parser import HTMLParser

from app.config import settings

log = logging.getLogger(__name__)

SITE_PAGES = [
    "/",
    "/about",
    "/education",
    "/vinayakagnana-vidyashale-mysore",
    "/vinayakagnana-vidyashale-mysore/gallery",
    "/adarsha-academy-krs",
    "/adarsha-academy-krs/gallery",
    "/women-empowerment",
    "/self-help-group-federation",
    "/micro-finance-initiatives",
    "/skills-and-employment",
    "/stitching-unit",
    "/health-camps",
    "/health-awareness",
    "/impact",
    "/getinvolved",
    "/contact",
    "/blogs",
    "/blogs/creating-brighter-learning-spaces-in-rural-schools",
    "/blogs/community-health-initiatives-in-action",
    "/blogs/strengthening-womens-collectives",
    "/blogs/supporting-sustainable-farming-practices",
    "/blogs/listening-to-build-stronger-villages",
    "/blogs/skills-for-a-brighter-tomorrow",
    "/blogs/the-ripple-effect-of-a-single-opportunity",
    "/blogs/unlocking-youth-potential-through-digital-skills",
    "/blogs/revitalizing-village-commons-and-water-bodies",
    "/blogs/preventative-health-and-wellness-for-all",
    "/blogs/organic-farming-clusters-bring-sustainable-yields",
    "/blogs/from-savings-groups-to-micro-enterprises",
    "/blogs/investing-in-the-next-generation-of-leaders",
    "/blogs/the-grama-sabha-revival-village-assemblies-take-charge-of-education",
    "/blogs/how-traditional-tank-desiltation-revived-30-smallholdings-in-hanur",
    "/blogs/mysore-womens-guild-exports-first-hand-loom-batch-to-bangalore-partner",
]

PAGE_LABELS = {
    "/": "Home - International Human Development and Uplifting Academy",
    "/about": "About Us - IHDUA",
    "/education": "Education Programs - IHDUA",
    "/vinayakagnana-vidyashale-mysore": "Vinayaka Jnana Vidyashale Mysore",
    "/vinayakagnana-vidyashale-mysore/gallery": "Vinayaka Vidyashale Photo Gallery",
    "/adarsha-academy-krs": "Adarsha Academy KRS",
    "/adarsha-academy-krs/gallery": "Adarsha Academy Photo Gallery",
    "/women-empowerment": "Women Empowerment & Livelihoods",
    "/self-help-group-federation": "Self-Help Groups & Federation",
    "/micro-finance-initiatives": "Microfinance Initiatives",
    "/skills-and-employment": "Skills & Employment",
    "/stitching-unit": "Stitching & Garment Production Unit",
    "/health-camps": "Free Medical & Healthcare Camps",
    "/health-awareness": "Healthcare Awareness & Nutrition",
    "/impact": "Our Impact & Key Achievements",
    "/getinvolved": "Get Involved & Volunteering",
    "/contact": "Contact Us - Offices & Location",
    "/blogs": "Blogs & Field Stories",
    "/blogs/creating-brighter-learning-spaces-in-rural-schools": "Creating Brighter Learning Spaces in Rural Schools",
    "/blogs/community-health-initiatives-in-action": "Community Health Initiatives in Action",
    "/blogs/strengthening-womens-collectives": "Strengthening Women's Collectives",
    "/blogs/supporting-sustainable-farming-practices": "Supporting Sustainable Farming Practices",
    "/blogs/listening-to-build-stronger-villages": "Listening to Build Stronger Villages",
    "/blogs/skills-for-a-brighter-tomorrow": "Skills for a Brighter Tomorrow",
    "/blogs/the-ripple-effect-of-a-single-opportunity": "The Ripple Effect: How Shanthamma Secured Her Family's Future",
    "/blogs/unlocking-youth-potential-through-digital-skills": "Unlocking Youth Potential Through Digital Skills",
    "/blogs/revitalizing-village-commons-and-water-bodies": "Revitalizing Village Commons and Water Bodies",
    "/blogs/preventative-health-and-wellness-for-all": "Preventative Health and Wellness for All",
    "/blogs/organic-farming-clusters-bring-sustainable-yields": "Organic Farming Clusters Bring Sustainable Yields",
    "/blogs/from-savings-groups-to-micro-enterprises": "From Savings Groups to Micro-Enterprises",
    "/blogs/investing-in-the-next-generation-of-leaders": "Investing in the Next Generation of Leaders",
    "/blogs/the-grama-sabha-revival-village-assemblies-take-charge-of-education": "The Grama Sabha Revival",
    "/blogs/how-traditional-tank-desiltation-revived-30-smallholdings-in-hanur": "Community Desiltation in Hanur",
    "/blogs/mysore-womens-guild-exports-first-hand-loom-batch-to-bangalore-partner": "Mysore Women's Guild Artisan Export",
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
            log.warning("Could not fetch %s%s: %s", base, path, exc)
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
                "content": f"Title: {title}\nCategory: Page\nWebsite page: {path}\n\n{text}",
            }
        )
    return docs, failed

from __future__ import annotations

import logging
from pathlib import Path
import re

log = logging.getLogger(__name__)


def _get_frontend_dir() -> Path | None:
    # Resolve frontend relative to ai-chatbot location
    candidate = Path(__file__).resolve().parents[3] / "frontend"
    if candidate.exists():
        return candidate
    candidate2 = Path("frontend")
    if candidate2.exists():
        return candidate2.resolve()
    return None


def load_website_documents() -> list[dict]:
    frontend = _get_frontend_dir()
    if not frontend or not frontend.exists():
        log.warning("Frontend directory not found for website data extraction")
        return []

    docs: list[dict] = []

    # 1. Load all Blog Posts from frontend/src/domains/blogs/constants/blogsData.ts
    blogs_file = frontend / "src/domains/blogs/constants/blogsData.ts"
    if blogs_file.exists():
        try:
            text = blogs_file.read_text(encoding="utf-8")
            raw_posts = re.split(r'\n\s*\{\s*\n\s*id:\s*["\']', text)[1:]
            for raw in raw_posts:
                slug_m = re.search(r'slug:\s*["\']([^"\']+)["\']', raw)
                title_m = re.search(r'title:\s*["\']([^"\']+)["\']', raw)
                subtitle_m = re.search(r'subtitle:\s*["\']([^"\']+)["\']', raw)
                category_m = re.search(r'category:\s*["\']([^"\']+)["\']', raw)
                date_m = re.search(r'date:\s*["\']([^"\']+)["\']', raw)
                excerpt_m = re.search(r'excerpt:\s*["\']([^"\']+)["\']', raw)
                lead_m = re.search(r'leadParagraph:\s*["\']([^"\']+)["\']', raw)

                slug = slug_m.group(1) if slug_m else ""
                title = title_m.group(1) if title_m else ""
                subtitle = subtitle_m.group(1) if subtitle_m else ""
                category = category_m.group(1) if category_m else "Story"
                date = date_m.group(1) if date_m else ""
                excerpt = excerpt_m.group(1) if excerpt_m else ""
                lead = lead_m.group(1) if lead_m else ""

                if not slug or not title:
                    continue

                # Collect all long paragraph strings
                paragraphs = re.findall(r'["\']([^"\']{35,})["\']', raw)
                content_body = "\n\n".join(paragraphs)

                url = f"/blogs/{slug}"
                full_title = f"{title}: {subtitle}" if subtitle else title
                full_content = (
                    f"Title: {full_title}\n"
                    f"Category: {category}\n"
                    f"Date: {date}\n"
                    f"Website URL: {url}\n"
                    f"Summary: {excerpt}\n\n"
                    f"Overview: {lead}\n\n"
                    f"Content:\n{content_body}"
                )

                docs.append(
                    {
                        "table": "website_data",
                        "source_id": f"blog/{slug}",
                        "title": full_title,
                        "url": url,
                        "category": "Blog",
                        "content": full_content,
                    }
                )
        except Exception as e:
            log.warning("Failed parsing blogsData.ts: %s", e)

    # 2. Load Leadership from frontend/src/domains/about/constants/meetourleadership.ts
    leadership_file = frontend / "src/domains/about/constants/meetourleadership.ts"
    if leadership_file.exists():
        try:
            l_text = leadership_file.read_text(encoding="utf-8")
            quote_m = re.search(r'LEADERSHIP_QUOTE\s*=\s*["\']([^"\']+)["\']', l_text)
            quote = quote_m.group(1) if quote_m else ""

            docs.append(
                {
                    "table": "website_data",
                    "source_id": "about/leadership",
                    "title": "Meet Our Leadership (Dr. B.S. Ajaikumar & Bhagya Ajaikumar)",
                    "url": "/about",
                    "category": "Leadership",
                    "content": (
                        "Title: Meet Our Leadership - IHDUA\n"
                        "Category: Leadership\n"
                        "Website URL: /about\n\n"
                        f"Leadership Vision: {quote}\n\n"
                        "Key Leaders:\n"
                        "• Dr. B.S. Ajaikumar - Chairperson & Founder:\n"
                        "  Globally recognized surgical oncologist, healthcare visionary, humanitarian, and philanthropist. "
                        "Dr. Ajaikumar established IHDUA over two decades ago to bring transformative development, quality education, "
                        "and self-reliance to rural Karnataka. Under his stewardship, IHDUA has reached 202+ villages, formed 697+ SHGs, "
                        "and runs Vinayaka Jnana Vidyashale in Mysore and Adarsha Academy in KRS.\n\n"
                        "• Bhagya Ajaikumar - Trustee:\n"
                        "  Actively guides community outreach, women empowerment, education quality, and institutional governance."
                    ),
                }
            )
        except Exception as e:
            log.warning("Failed parsing meetourleadership.ts: %s", e)

    # 3. Load Ripple Effect Story (Shanthamma) from frontend/src/domains/home/constants/RippleEffectSection.ts
    ripple_file = frontend / "src/domains/home/constants/RippleEffectSection.ts"
    if ripple_file.exists():
        try:
            r_text = ripple_file.read_text(encoding="utf-8")
            steps = re.findall(r'label:\s*["\']([^"\']+)["\'],\s*description:\s*["\']([^"\']+)["\']', r_text)
            steps_desc = "\n".join(f"• {label}: {desc}" for label, desc in steps)

            docs.append(
                {
                    "table": "website_data",
                    "source_id": "home/ripple-effect-shanthamma",
                    "title": "The Ripple Effect: How Shanthamma Secured Her Family's Future",
                    "url": "/blogs/the-ripple-effect-of-a-single-opportunity",
                    "category": "Field Story",
                    "content": (
                        "Title: The Ripple Effect: How Shanthamma Secured Her Family's Future\n"
                        "Category: Field Story\n"
                        "Website URL: /blogs/the-ripple-effect-of-a-single-opportunity\n\n"
                        "Shanthamma's Story of Transformation:\n"
                        f"{steps_desc}\n\n"
                        "Targeted microfinance, drip irrigation, and self-help training helped Shanthamma stabilize her income "
                        "and enabled her eldest daughter to enter college in Mysore."
                    ),
                }
            )
        except Exception as e:
            log.warning("Failed parsing RippleEffectSection.ts: %s", e)

    # 4. Load Adarsha Academy School from frontend/src/domains/impact/education/constants/adarshaSchool.ts
    adarsha_file = frontend / "src/domains/impact/education/constants/adarshaSchool.ts"
    if adarsha_file.exists():
        try:
            a_text = adarsha_file.read_text(encoding="utf-8")
            story_m = re.findall(r'["\']([^"\']{50,})["\']', a_text)
            body = "\n\n".join(story_m)
            docs.append(
                {
                    "table": "website_data",
                    "source_id": "education/adarsha-academy",
                    "title": "Adarsha Academy KRS - Rural School Overview & History",
                    "url": "/adarsha-academy-krs",
                    "category": "Education",
                    "content": (
                        "Title: Adarsha Academy KRS\n"
                        "Category: Education\n"
                        "Website URL: /adarsha-academy-krs\n\n"
                        "History & Details:\n"
                        f"{body}"
                    ),
                }
            )
        except Exception as e:
            log.warning("Failed parsing adarshaSchool.ts: %s", e)

    # 5. Load Vinayaka Jnana Vidyashale from frontend/src/domains/impact/education/constants/vinayakaSchool.ts
    vinayaka_file = frontend / "src/domains/impact/education/constants/vinayakaSchool.ts"
    if vinayaka_file.exists():
        try:
            v_text = vinayaka_file.read_text(encoding="utf-8")
            story_m = re.findall(r'["\']([^"\']{50,})["\']', v_text)
            body = "\n\n".join(story_m)
            docs.append(
                {
                    "table": "website_data",
                    "source_id": "education/vinayaka-vidyashale",
                    "title": "Vinayaka Jnana Vidyashale Mysore - Rural School Overview",
                    "url": "/vinayakagnana-vidyashale-mysore",
                    "category": "Education",
                    "content": (
                        "Title: Vinayaka Jnana Vidyashale Mysore\n"
                        "Category: Education\n"
                        "Website URL: /vinayakagnana-vidyashale-mysore\n\n"
                        "History & Details:\n"
                        f"{body}"
                    ),
                }
            )
        except Exception as e:
            log.warning("Failed parsing vinayakaSchool.ts: %s", e)

    # 6. Load Milestones & History from frontend/src/domains/about/constants/milestone.ts
    milestone_file = frontend / "src/domains/about/constants/milestone.ts"
    if milestone_file.exists():
        try:
            m_text = milestone_file.read_text(encoding="utf-8")
            milestones = re.findall(r'year:\s*["\']([^"\']+)["\'],\s*description:\s*["\']([^"\']+)["\']', m_text)
            m_desc = "\n".join(f"• {year}: {desc}" for year, desc in milestones)
            docs.append(
                {
                    "table": "website_data",
                    "source_id": "about/milestones",
                    "title": "IHDUA Historical Milestones & Journey (1991 - 2026)",
                    "url": "/about",
                    "category": "About",
                    "content": (
                        "Title: IHDUA Historical Milestones\n"
                        "Category: About\n"
                        "Website URL: /about\n\n"
                        "Timeline of Progress:\n"
                        f"{m_desc}"
                    ),
                }
            )
        except Exception as e:
            log.warning("Failed parsing milestone.ts: %s", e)

    log.info("Loaded %d rich website documents directly from frontend source data", len(docs))
    return docs

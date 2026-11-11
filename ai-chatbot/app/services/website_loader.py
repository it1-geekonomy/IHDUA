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

    # 7. Load Mission, Vision & Values and Who We Are
    about_whoweare = frontend / "src/domains/about/constants/whoweare.ts"
    about_mvv = frontend / "src/domains/about/constants/missionvisionvalues.ts"
    if about_whoweare.exists() or about_mvv.exists():
        try:
            about_content = [
                "Title: Who We Are, Mission, Vision and Values - IHDUA",
                "Category: About",
                "Website URL: /about\n",
                "Mission: To empower rural communities through sustainable and inclusive development initiatives.",
                "Vision: A just and equitable society where every individual has the opportunity to live a healthy, dignified and productive life.",
                "Values: Compassion, Integrity, Inclusivity, Sustainability, Community Ownership, Accountability.\n",
                "Approach: Community participation, local ownership and long-term impact across education, skill development, women's empowerment, sustainable livelihoods and community development.",
            ]
            docs.append(
                {
                    "table": "website_data",
                    "source_id": "about/whoweare-mission",
                    "title": "Who We Are, Mission, Vision & Values",
                    "url": "/about",
                    "category": "About",
                    "content": "\n".join(about_content),
                }
            )
        except Exception as e:
            log.warning("Failed parsing about constants: %s", e)

    # 8. Load Farmers and Sustainable Agriculture
    docs.append(
        {
            "table": "website_data",
            "source_id": "farmers/sustainable-farming",
            "title": "Farmer Empowerment & Sustainable Agriculture Initiatives",
            "url": "/farmers",
            "category": "Farmers",
            "content": (
                "Title: Farmer Empowerment & Sustainable Agriculture\n"
                "Category: Farmers\n"
                "Website URL: /farmers\n\n"
                "Overview: IHDUA supports rural farmers through agricultural initiatives, practical training and sustainable farming practices that strengthen rural livelihoods.\n"
                "Focus Areas: Sustainable agriculture, soil health, crop cultivation and livestock care.\n"
                "Impact Achievements:\n"
                "• 48+ Farmers completed Soil Health training and soil fertility management.\n"
                "• 32+ Farmers participated in Turmeric Cultivation awareness.\n"
                "• 15 Farmers adopted Foxtail Millet as an eco-resilient crop.\n"
                "• 3,290+ Farmers received high-yield green maize fodder for cattle nutrition.\n"
                "• 43 Farmer SHGs supported with organic inputs and market linkages."
            ),
        }
    )

    # 9. Load Youth Empowerment & Vocational Opportunities
    docs.append(
        {
            "table": "website_data",
            "source_id": "youth/skills-opportunities",
            "title": "Youth Empowerment, Vocational Skills & Career Opportunities",
            "url": "/youth",
            "category": "Youth",
            "content": (
                "Title: Youth Skills & Opportunities\n"
                "Category: Youth\n"
                "Website URL: /youth\n\n"
                "Overview: IHDUA supports rural youth through skill development and vocational training to build practical skills and future employment opportunities.\n"
                "Key Training Programmes & Numbers:\n"
                "• 514+ Computer course participants (MS Office, digital literacy, communications).\n"
                "• 265+ (267+) General Duty Assistant (GDA) nursing care participants placed in healthcare.\n"
                "• 2,161+ (2,174+) Tailoring training participants.\n"
                "• 3,290+ Total skill development participants recorded across all programs."
            ),
        }
    )

    # 10. Load Health Awareness & Medical Camps
    docs.append(
        {
            "table": "website_data",
            "source_id": "health/awareness-initiatives",
            "title": "Healthcare Awareness, Nutrition, Anaemia & Camps",
            "url": "/health-awareness",
            "category": "Healthcare",
            "content": (
                "Title: Healthcare Awareness & Medical Camps\n"
                "Category: Healthcare\n"
                "Website URL: /health-awareness\n\n"
                "Overview: IHDUA's health awareness programmes have covered nutrition, hygiene, anaemia and reproductive health for women, schoolchildren and Anganwadi workers.\n"
                "Recorded Impact:\n"
                "• 160 Reproductive and child health educational sessions.\n"
                "• 855 Women reached in nutrition & anaemia prevention sessions.\n"
                "• 988 Women reached through maternal and adolescent hygiene sessions.\n"
                "• 34+ Frontline Anganwadi workers trained.\n"
                "• 28 Free rural medical camps conducted with 3,487+ beneficiaries treated."
            ),
        }
    )

    # 11. Load Increase The Green Cover & Rejuvenation of Villages (Model Village)
    docs.append(
        {
            "table": "website_data",
            "source_id": "modelvillage/green-cover-rejuvenation",
            "title": "Model Village, Rejuvenation & Increase the Green Cover",
            "url": "/model-village",
            "category": "Environment",
            "content": (
                "Title: Model Village & Environmental Rejuvenation\n"
                "Category: Environment\n"
                "Website URL: /model-village\n\n"
                "The Model Village project implements Gram Swaraj principles for self-reliant rural settlements:\n"
                "Rejuvenation of Villages (/rejuvenation-of-villages):\n"
                "• 16+ Solar street lights installed for night safety.\n"
                "• 14+ People benefited from sanitation toilet construction.\n"
                "• 48 Soil health training participants.\n"
                "• 81+ Cattle supported by green fodder distribution.\n\n"
                "Increase the Green Cover (/increase-the-green-cover):\n"
                "• 5 Fruit saplings distributed per family.\n"
                "• 16 Community leaders participated in Model Village exposure visits.\n"
                "• 18 Participants from other villages engaged in exposure visits.\n"
                "• 32 Farmers reached through sunflower cultivation awareness."
            ),
        }
    )

    # 12. Load Governance, Documents & Legal Registrations
    docs.append(
        {
            "table": "website_data",
            "source_id": "about/transparency-documents",
            "title": "Governance, Transparency & Official Registrations (80G, FCRA)",
            "url": "/about",
            "category": "Governance",
            "content": (
                "Title: Transparency & Documents - IHDUA\n"
                "Category: Governance\n"
                "Website URL: /about\n\n"
                "Key Registrations & Compliance:\n"
                "• Private Trust Certificate (India): Officially registered under the Indian Trusts Act.\n"
                "• 80G Certificate: Donors receive 50% income tax deduction under Section 80G.\n"
                "• FCRA Certificate: Authorized by Ministry of Home Affairs for foreign funding.\n"
                "• US 501(c)(3) tax exemption status through IHDUA Chicago chapter.\n"
                "• Published Annual Reports detailing operational and audited financial statements."
            ),
        }
    )

    # 13. Load Volunteer and Partnership Avenues
    docs.append(
        {
            "table": "website_data",
            "source_id": "getinvolved/volunteer-partnerships",
            "title": "Get Involved: Volunteering & Corporate CSR Partnerships",
            "url": "/contact",
            "category": "Get Involved",
            "content": (
                "Title: Volunteering & Partnerships with IHDUA\n"
                "Category: Get Involved\n"
                "Website URL: /contact\n\n"
                "Volunteer Opportunities:\n"
                "• Teaching & Education at Vinayaka Jnana Vidyashale or Adarsha Academy KRS\n"
                "• Healthcare & Medical Camps\n"
                "• Community Outreach and Women Empowerment\n"
                "• Agriculture, Youth Development, and Digital Marketing\n\n"
                "Partnership Options:\n"
                "• Corporate CSR Partnerships (registered under MCA guidelines)\n"
                "• NGO / Non-Profit Collaboration & Academic Partnerships\n"
                "• Programme Sponsorship & Rural Infrastructure Development"
            ),
        }
    )

    log.info("Loaded %d rich website documents directly from frontend source data", len(docs))
    return docs

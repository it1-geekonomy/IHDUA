from __future__ import annotations

import logging
from pathlib import Path
from app.config import settings

log = logging.getLogger(__name__)


def _static_documents() -> list[dict]:
    return [
        {
            "table": "static",
            "source_id": "about-ihdua",
            "title": "About IHDUA (International Human Development and Uplifting Academy)",
            "url": "/about",
            "category": "About",
            "content": (
                "Title: About IHDUA\nCategory: About\nWebsite: /about\n\n"
                "The International Humanitarian Development & Upliftment Association (IHDUA) is a registered "
                "not-for-profit organisation working with rural and underserved communities to improve quality "
                "of life through education, healthcare, livelihood support, and sustainable development.\n"
                "For more than two decades, IHDUA has worked at the grassroots level in Karnataka, India, "
                "and internationally through its USA chapter in Chicago.\n"
                "Mission: To empower rural communities through sustainable and inclusive development initiatives.\n"
                "Vision: A just and equitable society where every individual has the opportunity to live a healthy, "
                "dignified, and productive life.\n"
                "Core Values: Compassion, Integrity, Inclusivity, Sustainability, Community Ownership, and Accountability."
            ),
        },
        {
            "table": "static",
            "source_id": "impact-statistics",
            "title": "IHDUA Impact Numbers & Achievements",
            "url": "/#our-impact",
            "category": "Impact",
            "content": (
                "Title: Key Impact & Statistics\nCategory: Impact\nWebsite: /#our-impact\n\n"
                "IHDUA's grassroots footprint includes:\n"
                "• 202+ Villages Reached across Karnataka\n"
                "• 697+ Self-Help Groups (SHGs) Formed across 18 Federations\n"
                "• 7,578+ Active Women SHG Members\n"
                "• ₹9.14+ Crores in low-interest bank loans and credit linkages facilitated (218+ credit linkages)\n"
                "• 5,000+ Total People & Learners Trained\n"
                "  - 2,174+ Women trained in Tailoring & Garment Stitching\n"
                "  - 514+ Rural Youth trained in Computers & Digital Literacy\n"
                "  - 267+ Trained as General Duty Nursing Care Assistants (GDA)\n"
                "• 663+ Income Generation Micro-Enterprises launched\n"
                "• 43 Farmer SHGs supported\n"
                "• 135 Schools Reached & 28 Free Health Camps conducted with 3,487+ beneficiaries."
            ),
        },
        {
            "table": "static",
            "source_id": "education-schools",
            "title": "Education Initiatives & Schools (Vinayaka & Adarsha)",
            "url": "/education",
            "category": "Education",
            "content": (
                "Title: Education Programs\nCategory: Education\nWebsite: /education\n\n"
                "IHDUA operates two flagship rural schools:\n"
                "1. Vinayaka Jnana Vidyashale (/vinayakagnana-vidyashale-mysore): Flagship school in Mysore providing "
                "quality education to rural and economically underprivileged children. Offers modern classrooms, "
                "science laboratories, computer literacy, sports, arts, and nutritious midday meals.\n"
                "2. Adarsha Academy KRS (/adarsha-academy-krs): Located in Krishnarajasagara (KRS), offering progressive "
                "rural education with experiential STEM learning, digital literacy, arts, and character development.\n"
                "Scholarships and subsidized fees ensure no child is deprived of education."
            ),
        },
        {
            "table": "static",
            "source_id": "women-shg-federation",
            "title": "Women Empowerment & Self-Help Group (SHG) Federation",
            "url": "/women-empowerment",
            "category": "Women",
            "content": (
                "Title: Women Empowerment & SHGs\nCategory: Women\nWebsite: /women-empowerment\n\n"
                "IHDUA has mobilized 7,578+ rural women into 697+ Self-Help Groups (SHGs) under 18 registered Federations. "
                "The federation provides a unified platform for community savings, mutual support, leadership training, "
                "and micro-enterprise incubation. Women gain financial independence, break free from moneylenders, "
                "and take an active role in local panchayat and community decision-making."
            ),
        },
        {
            "table": "static",
            "source_id": "microfinance-initiatives",
            "title": "Microfinance & Bank Credit Linkages",
            "url": "/micro-finance-initiatives",
            "category": "Microfinance",
            "content": (
                "Title: Microfinance Initiatives\nCategory: Microfinance\nWebsite: /micro-finance-initiatives\n\n"
                "Through institutional partnerships with nationalized and cooperative banks, IHDUA connects women SHGs "
                "with formal credit linkages at fair interest rates without predatory collateral. Over ₹9.14 Crores has been "
                "disbursed across 218+ credit linkages, empowering women to launch dairy farms, grocery stores, tailoring shops, "
                "and artisanal enterprises."
            ),
        },
        {
            "table": "static",
            "source_id": "stitching-unit-skills",
            "title": "Stitching & Garment Production Unit",
            "url": "/stitching-unit",
            "category": "Skills",
            "content": (
                "Title: Stitching Unit & Garment Production\nCategory: Skills\nWebsite: /stitching-unit\n\n"
                "The IHDUA Stitching Unit has trained over 2,174 women in industrial garment cutting, pattern making, "
                "and machine stitching. Graduates either work directly at the IHDUA production hub manufacturing uniforms "
                "and garments, or establish home-based tailoring enterprises, achieving sustained economic self-reliance."
            ),
        },
        {
            "table": "static",
            "source_id": "model-village-green-cover",
            "title": "Model Village & Increase the Green Cover",
            "url": "/model-village",
            "category": "Environment",
            "content": (
                "Title: Model Village & Environmental Rejuvenation\nCategory: Environment\nWebsite: /model-village\n\n"
                "IHDUA champions the Gram Swaraj model of self-reliant villages:\n"
                "• Rejuvenation of Villages (/rejuvenation-of-villages): Upgrading sanitation, solar street lighting, "
                "community centers, and clean drinking water facilities.\n"
                "• Increase the Green Cover (/increase-the-green-cover): Afforestation drives planting thousands of native "
                "trees across schools, village borders, and commons to counter climate stress and enhance biodiversity."
            ),
        },
        {
            "table": "static",
            "source_id": "healthcare-initiatives",
            "title": "Healthcare Initiatives & Free Medical Camps",
            "url": "/health-camps",
            "category": "Healthcare",
            "content": (
                "Title: Healthcare Initiatives\nCategory: Healthcare\nWebsite: /health-camps\n\n"
                "IHDUA conducts free rural Medical Camps and health awareness campaigns:\n"
                "• 28+ Free Medical Camps conducted, treating 3,487+ beneficiaries in remote villages.\n"
                "• Comprehensive diagnostic checkups, vision tests, pediatric care, cancer screening, and free medications.\n"
                "• Health Awareness workshops (/health-awareness) educating rural women on maternal health, menstrual hygiene, "
                "and child nutrition."
            ),
        },
        {
            "table": "static",
            "source_id": "donation-tax-exemptions",
            "title": "Donations, Payment Modes & 80G / 501(c)(3) Tax Benefits",
            "url": "/#donate",
            "category": "Donation",
            "content": (
                "Title: Donations & Tax Deductions\nCategory: Donation\nWebsite: /#donate\n\n"
                "Donations to IHDUA qualify for official tax exemptions:\n"
                "• For Indian Donors: Donations are eligible for tax deductions under Section 80G of the Income Tax Act "
                "(50% deduction on taxable income). An official 80G tax receipt is issued.\n"
                "• For US Donors: Donations are tax-deductible under Section 501(c)(3) via the IHDUA Chicago chapter.\n"
                "Payment Modes: Instant online donations on the website via UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, "
                "and Net Banking. Sponsorships available for student education, sewing machines, tree planting, and health camps."
            ),
        },
        {
            "table": "static",
            "source_id": "contact-offices",
            "title": "Offices, Locations & Contact Details",
            "url": "/contact",
            "category": "Contact",
            "content": (
                "Title: Contact & Offices\nCategory: Contact\nWebsite: /contact\n\n"
                "📍 India Headquarters (Mysore):\n"
                "• Address: IHDUA Center, Mysore-Ooty Road, Mysore, Karnataka 570008, India\n"
                "• Registered Office: 18 & 19, Hebbal Industrial Estate, near Bharath Cancer Hospital, Hebbalu, Mysore 570016\n"
                "• Phone: +91 821 248 1234\n"
                "• Email: info@ihdua.org\n"
                "• Hours: Monday – Saturday, 9:00 AM – 5:00 PM\n\n"
                "📍 United States Chapter (Chicago):\n"
                "• Address: IHDUA - 360 E Randolph St, Apt 3701, Chicago, IL 60601, USA\n"
                "• Phone: +1 (312) 819-0691\n\n"
                "Directions: Google Maps navigation is available on the Contact page."
            ),
        },
    ]


def load_knowledge_files() -> list[dict]:
    root = Path(settings.knowledge_dir)
    if not root.exists():
        return []

    url_map = {
        "about_ihdua": ("/about", "About"),
        "donations_80g_tax": ("/#donate", "Donation"),
        "education_schools": ("/education", "Education"),
        "healthcare_camps": ("/health-camps", "Healthcare"),
        "model_village_green_cover": ("/model-village", "Environment"),
        "offices_contact": ("/contact", "Contact"),
        "skills_stitching_unit": ("/stitching-unit", "Skills"),
        "women_shg_microfinance": ("/women-empowerment", "Women"),
    }

    docs: list[dict] = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in {".txt", ".md"}:
            continue
        raw = path.read_text(encoding="utf-8", errors="ignore").strip()
        if not raw:
            continue
        stem = path.stem.lower()
        url, cat = url_map.get(stem, ("/about", "Knowledge"))
        title = path.stem.replace("_", " ").title()
        docs.append(
            {
                "table": "knowledge",
                "source_id": f"public/{path.name}",
                "title": title,
                "url": url,
                "category": cat,
                "content": f"Title: {title}\nCategory: {cat}\nWebsite: {url}\n\n{raw}",
            }
        )
    return docs


from app.services.website_loader import load_website_documents


def load_corpus_documents() -> list[dict]:
    return load_website_documents() + _static_documents() + load_knowledge_files()

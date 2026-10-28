OFFICIAL_EMAIL = "info@ihdua.org"
OFFICIAL_PHONE = "+91 821 248 1234"
OFFICIAL_ADDRESS = (
    "IHDUA Center, Mysore-Ooty Road / 18 & 19 Hebbal Industrial Estate, "
    "near Bharath Cancer Hospital, Hebbalu, Mysore, Karnataka 570016, India"
)
USA_OFFICE_ADDRESS = "360 E Randolph St, Apt 3701, Chicago, IL 60601, USA"
USA_PHONE = "+1 (312) 819-0691"

# --- Public website routes ---
DONATE_URL = "/#donate"
ABOUT_URL = "/about"
EDUCATION_URL = "/education"
VINAYAKA_URL = "/vinayakagnana-vidyashale-mysore"
ADARSHA_URL = "/adarsha-academy-krs"
WOMEN_URL = "/women-empowerment"
SHG_URL = "/self-help-group-federation"
MICROFINANCE_URL = "/micro-finance-initiatives"
SKILLS_URL = "/skills-and-employment"
STITCHING_URL = "/stitching-unit"
YOUTH_URL = "/youth"
FARMERS_URL = "/farmers"
MODEL_VILLAGE_URL = "/model-village"
REJUVENATION_URL = "/rejuvenation-of-villages"
GREEN_COVER_URL = "/increase-the-green-cover"
HEALTH_URL = "/health"
HEALTH_CAMPS_URL = "/health-camps"
HEALTH_AWARENESS_URL = "/health-awareness"
CONTACT_URL = "/contact"
BLOGS_URL = "/blogs"

PAGE_LABELS = {
    "/": "Home",
    ABOUT_URL: "About Us",
    EDUCATION_URL: "Education Programs",
    VINAYAKA_URL: "Vinayaka Jnana Vidyashale",
    ADARSHA_URL: "Adarsha Academy KRS",
    WOMEN_URL: "Women Empowerment",
    SHG_URL: "Self-Help Groups & Federation",
    MICROFINANCE_URL: "Microfinance Initiatives",
    SKILLS_URL: "Skills & Employment",
    STITCHING_URL: "Stitching Unit",
    YOUTH_URL: "Youth Programs",
    FARMERS_URL: "Farmers Initiatives",
    MODEL_VILLAGE_URL: "Model Village",
    REJUVENATION_URL: "Rejuvenation of Villages",
    GREEN_COVER_URL: "Increase the Green Cover",
    HEALTH_URL: "Healthcare Initiatives",
    HEALTH_CAMPS_URL: "Free Health Camps",
    HEALTH_AWARENESS_URL: "Health Awareness",
    CONTACT_URL: "Contact Us",
    DONATE_URL: "Donate Now (80G Tax Exemption)",
    BLOGS_URL: "Blogs & Stories",
}

NO_ANSWER_TOKEN = "NO_ANSWER_FOUND"

FALLBACK_ANSWER = (
    "I could not find that specific detail in IHDUA's published information. "
    f"For official assistance, please reach out directly at {OFFICIAL_EMAIL} or call {OFFICIAL_PHONE}."
)

OUT_OF_SCOPE_ANSWER = (
    "I am here to help with questions about IHDUA (International Human Development and Uplifting Academy) "
    "and its rural development programs. You can ask me about our schools (Vinayaka Vidyashale and Adarsha Academy), "
    "women Self-Help Groups, microfinance, the Stitching Unit, health camps, or 80G tax-exempt donations."
)

SETUP_ANSWER = (
    "I am currently indexing my knowledge base. Please try asking again in a moment, "
    f"or contact us at {OFFICIAL_EMAIL} / {OFFICIAL_PHONE}."
)

GREETING_ANSWER = (
    "Hello! 👋 I am the **IHDUA AI Assistant**. I can help you with details about our educational institutions, "
    "women Self-Help Groups, microfinance, health camps, and 80G / 501(c)(3) tax-exempt donations.\n\n"
    f"Official Contact: {OFFICIAL_EMAIL} | {OFFICIAL_PHONE}"
)

CONTACT_ANSWER = (
    "You can reach IHDUA at:\n"
    f"• **Mysore Headquarters:** {OFFICIAL_ADDRESS}\n"
    f"• **Phone:** {OFFICIAL_PHONE}\n"
    f"• **Email:** {OFFICIAL_EMAIL}\n"
    "• **Office Hours:** Monday to Saturday, 9:00 AM – 5:00 PM\n"
    f"• **USA Chapter:** {USA_OFFICE_ADDRESS} (Phone: {USA_PHONE})"
)

THANKS_ANSWER = "You're very welcome! Let me know if you would like to know anything more about IHDUA's programs."

DONATE_INTENT_ANSWER = (
    "You can make a secure online donation on our website using the **Donate** form (UPI, Netbanking, Cards). "
    "All eligible donations qualify for **80G tax exemption** in India (50% deduction) and **501(c)(3)** deductions in the USA.\n\n"
    f"For custom donor support or CSR partnerships, email {OFFICIAL_EMAIL} or call {OFFICIAL_PHONE}."
)

LEADERSHIP_ANSWER = (
    "**IHDUA Leadership & Governance:**\n\n"
    "• **Dr. B.S. Ajaikumar – Chairperson & Founder:** A globally recognized surgical oncologist, healthcare visionary, and philanthropist. Dr. Ajaikumar established IHDUA over two decades ago to uplift rural Karnataka through quality education, healthcare, women empowerment, self-help groups, and sustainable rural infrastructure.\n"
    "• **Bhagya Ajaikumar – Trustee:** Actively guides community outreach, women's empowerment initiatives, and institutional governance.\n\n"
    f"You can read more about our board and vision on the [About Us]({ABOUT_URL}) page under Meet Our Leadership."
)

SHANTHAMMA_ANSWER = (
    "**The Ripple Effect of a Single Opportunity: How Shanthamma Secured Her Family's Future**\n\n"
    "• **The Challenge:** Farming with erratic monsoons led Shanthamma's small landholding into severe debt, jeopardizing her children's secondary education.\n"
    "• **IHDUA's Intervention:** IHDUA provided direct drip-irrigation infrastructure combined with intensive organic multi-cropping bio-nutrient training, microfinance, and Self-Help Group (SHG) membership.\n"
    "• **The Outcome:** Shanthamma's agricultural yields increased by 140%, stabilizing her family's income year-round. With the renewed financial security, her eldest daughter entered college in Mysore!\n\n"
    f"Read more inspirational field stories on our [Blogs & Stories]({BLOGS_URL}/the-ripple-effect-of-a-single-opportunity) page."
)

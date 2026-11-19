# --- Public website routes ---
DONATE_URL = "/donate"
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
    "I could not find that detail in IHDUA's published information, so I don't want to guess. "
    f"Please reach out to the IHDUA team through the [Contact Us]({CONTACT_URL}) page and they will help you."
)
FALLBACK_ANSWER_KN = (
    "ಐಎಚ್‌ಡಿಯುಎ ಪ್ರಕಟಿತ ಮಾಹಿತಿಯಲ್ಲಿ ಆ ವಿವರ ಸಿಗಲಿಲ್ಲ, ಆದ್ದರಿಂದ ನಾನು ಊಹಿಸಲು ಇಚ್ಛಿಸುವುದಿಲ್ಲ. "
    f"ದಯವಿಟ್ಟು [ಸಂಪರ್ಕಿಸಿ]({CONTACT_URL}) ಪುಟದ ಮೂಲಕ ಐಎಚ್‌ಡಿಯುಎ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ."
)

OUT_OF_SCOPE_ANSWER = (
    "I can only help with questions about IHDUA, its programmes, stories, impact and donations. "
    "Please ask me something about IHDUA."
)
OUT_OF_SCOPE_ANSWER_KN = (
    "ನಾನು ಐಎಚ್‌ಡಿಯುಎ, ಅದರ ಕಾರ್ಯಕ್ರಮಗಳು, ಕಥೆಗಳು, ಪರಿಣಾಮ ಮತ್ತು ದೇಣಿಗೆಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. "
    "ದಯವಿಟ್ಟು ಐಎಚ್‌ಡಿಯುಎ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ."
)

SETUP_ANSWER = (
    "I am still loading IHDUA's latest information. Please try again in a moment, "
    f"or visit the [Contact Us]({CONTACT_URL}) page."
)
SETUP_ANSWER_KN = (
    "ನಾನು ಇನ್ನೂ ಐಎಚ್‌ಡಿಯುಎ ಇತ್ತೀಚಿನ ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡುತ್ತಿದ್ದೇನೆ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ, "
    f"ಅಥವಾ [ಸಂಪರ್ಕಿಸಿ]({CONTACT_URL}) ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
)

GREETING_ANSWER = (
    "Hello! 👋 I am the **IHDUA AI Assistant**. Ask me about IHDUA's programmes, stories, impact, "
    "leadership or how to donate."
)
GREETING_ANSWER_KN = (
    "ನಮಸ್ಕಾರ! 👋 ನಾನು **ಐಎಚ್‌ಡಿಯುಎ AI ಸಹಾಯಕ**. ಐಎಚ್‌ಡಿಯುಎ ಕಾರ್ಯಕ್ರಮಗಳು, ಕಥೆಗಳು, ಪರಿಣಾಮ, "
    "ನಾಯಕತ್ವ ಅಥವಾ ದೇಣಿಗೆ ಬಗ್ಗೆ ಕೇಳಿ."
)

THANKS_ANSWER = "You're very welcome! Let me know if you would like to know anything more about IHDUA."
THANKS_ANSWER_KN = "ಸ್ವಾಗತ! ಐಎಚ್‌ಡಿಯುಎ ಬಗ್ಗೆ ಇನ್ನೇನಾದರೂ ತಿಳಿಯಬೇಕಿದ್ದರೆ ಹೇಳಿ."

ACK_ANSWER = "Alright! Whenever you're ready, ask me anything about IHDUA's programmes, stories, impact or donations."
ACK_ANSWER_KN = "ಸರಿ! ಸಿದ್ಧರಾದಾಗ ಐಎಚ್‌ಡಿಯುಎ ಕಾರ್ಯಕ್ರಮಗಳು, ಕಥೆಗಳು, ಪರಿಣಾಮ ಅಥವಾ ದೇಣಿಗೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ."

BYE_ANSWER = "Thank you for visiting IHDUA. Have a wonderful day!"
BYE_ANSWER_KN = "ಐಎಚ್‌ಡಿಯುಎಗೆ ಭೇಟಿ ನೀಡಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಶುಭ ದಿನ!"


def localize(text_en: str, language: str = "en") -> str:
    """Return the Kannada twin of a canned English answer when language is kn."""
    if (language or "en").lower() != "kn":
        return text_en
    mapping = {
        FALLBACK_ANSWER: FALLBACK_ANSWER_KN,
        OUT_OF_SCOPE_ANSWER: OUT_OF_SCOPE_ANSWER_KN,
        SETUP_ANSWER: SETUP_ANSWER_KN,
        GREETING_ANSWER: GREETING_ANSWER_KN,
        THANKS_ANSWER: THANKS_ANSWER_KN,
        ACK_ANSWER: ACK_ANSWER_KN,
        BYE_ANSWER: BYE_ANSWER_KN,
    }
    return mapping.get(text_en, text_en)

from __future__ import annotations

import re
from app.rag import constants as C

_GREETING_RE = re.compile(
    r"^(hi|hello|hey|greetings|namaste|vanakkam|good morning|good evening|good afternoon|hola|"
    r"ನಮಸ್ಕಾರ|ನಮಸ್ತೆ)[\s!.]*$",
    re.I,
)
_THANKS_RE = re.compile(
    r"^(thanks|thank you|thankyou|thx|much appreciated|great job|awesome|"
    r"ಧನ್ಯವಾದ|ಧನ್ಯವಾದಗಳು)[\s!.]*$",
    re.I,
)
_ACK_RE = re.compile(
    r"^(no|nope|nah|nothing|no thanks|no thank you|ok|okay|k|fine|cool|great|alright|got it|sure|yes|yeah|hmm+|"
    r"ಸರಿ|ಹೌದು|ಇಲ್ಲ)[\s!.]*$",
    re.I,
)
_BYE_RE = re.compile(
    r"^(bye|goodbye|see you|tata|good night|ವಿದಾಯ)[\s!.]*$",
    re.I,
)


def match_fast_intent(message: str, language: str = "en") -> dict | None:
    """Only small talk is answered without retrieval; every factual answer comes from indexed content."""
    msg = message.strip()
    if _GREETING_RE.match(msg):
        return {"answer": C.localize(C.GREETING_ANSWER, language), "sources": []}
    if _THANKS_RE.match(msg):
        return {"answer": C.localize(C.THANKS_ANSWER, language), "sources": []}
    if _BYE_RE.match(msg):
        return {"answer": C.localize(C.BYE_ANSWER, language), "sources": []}
    if _ACK_RE.match(msg):
        return {"answer": C.localize(C.ACK_ANSWER, language), "sources": []}
    return None


_INTENT_PATTERNS: dict[str, re.Pattern] = {
    "donate": re.compile(
        r"\b(donate|donations?|donating|80g|tax|taxes|tax-exempt|tax-exemption|501c|501\(c\)\(3\)|"
        r"contribute|contributions?|funds?|funding|receipts?|"
        r"project[\s-]*based|funding[\s-]*projects?|component[\s-]*wise|breakup)\b|"
        r"(ದೇಣಿಗೆ|ದಾನ|ರಸೀದಿ|ತೆರಿಗೆ)",
        re.I,
    ),
    "education": re.compile(
        r"\b(schools?|education|vinayaka|adarsha|krs|study|students?|teachers?|children)\b|"
        r"(ಶಾಲೆ|ಶಿಕ್ಷಣ|ವಿದ್ಯಾರ್ಥಿ|ವಿದ್ಯಾರ್ಥಿಗಳು)",
        re.I,
    ),
    "women": re.compile(
        r"\b(women|shg|shgs|self[\s-]*help|federations?|empowerment|women['s]?\s*savings)\b|"
        r"(ಮಹಿಳೆ|ಮಹಿಳೆಯರ|ಸಬಲೀಕರಣ|ಸ್ವಯಂ\s*ಸಹಾಯ)",
        re.I,
    ),
    "microfinance": re.compile(
        r"\b(microfinance|loans?|credits?|bank[\s-]*linkages?|interest)\b",
        re.I,
    ),
    "stitching": re.compile(
        r"\b(stitching|garments?|tailors?|tailoring|sewing)\b",
        re.I,
    ),
    "health": re.compile(
        r"\b(health|camps?|doctors?|medical|eye|checkups?|clinics?|cancer|anaemia|anemia|hygiene)\b",
        re.I,
    ),
    "model_village": re.compile(
        r"\b(model[\s-]*village|green[\s-]*cover|trees?|plants?|plantations?|afforestation|rejuvenation|sanitation|solar)\b",
        re.I,
    ),
    "farmers": re.compile(
        r"\b(farmers?|agriculture|farming|crops?|fodder|livestock|cattle|soil|harvest|organic|irrigation|pumps?)\b",
        re.I,
    ),
    "skills": re.compile(
        r"\b(youth|nursing|gda|computers?|skills?|vocational|assistants?|general[\s-]*duty)\b|"
        r"(ಯುವ|ಕೌಶಲ್ಯ|ತರಬೇತಿ|ಕಾರ್ಯಕ್ರಮ)",
        re.I,
    ),
    "governance": re.compile(
        r"\b(12a|12ab|80g|fcra|pan|trust[\s-]*deed|certificates?|downloads?|registration|form[\s-]*10ac|form[\s-]*10be)\b",
        re.I,
    ),
    "contact": re.compile(
        r"\b(contact|address|phones?|emails?|office|locations?|reach|hours|mysore|chicago)\b|"
        r"(ಕಚೇರಿ|ವಿಳಾಸ|ಸಂಪರ್ಕ|ಜಿಲ್ಲೆ)",
        re.I,
    ),
    "volunteer": re.compile(
        r"\b(volunteers?|volunteering|interns?|internships?|careers?|join|partner(s|ship|ships)?|collaborat\w*|csr|get\s+involved)\b|"
        r"(ಸ್ವಯಂಸೇವಕ|ಸ್ವಯಂ\s*ಸೇವಕ)",
        re.I,
    ),
    "leadership": re.compile(
        r"\b(founders?|chairpersons?|chairman|trustees?|leadership|leaders?|governance|board|team|director|ceo)\b",
        re.I,
    ),
    "about": re.compile(
        r"\b(about|mission|vision|values?|objectives?|aims?|ngo|non[\s-]*profit|who\s+(are|is)|what\s+is\s+ihdua|purpose)\b|"
        r"(ಯೋಜನೆ|ಕಾರ್ಯಕ್ರಮಗಳು|ಉದ್ದೇಶ)",
        re.I,
    ),
    "impact": re.compile(
        r"\b(impact|numbers?|statistics?|stats|how\s+many|achievements?|reached|beneficiar(y|ies))\b",
        re.I,
    ),
    "history": re.compile(
        r"\b(history|milestones?|founded|established|started|journey|annual\s+reports?)\b",
        re.I,
    ),
    "stories": re.compile(
        r"\b(story|stories|blogs?|articles?|news|beneficiaries|field[\s-]*story)\b",
        re.I,
    ),
}


def detect_intents(text: str) -> set[str]:
    intents = set()
    for intent, pattern in _INTENT_PATTERNS.items():
        if pattern.search(text):
            intents.add(intent)
    return intents


_OFF_TOPIC_RE = re.compile(
    r"\b(pm\s*(of|os|is)?\s*india|who\s+is\s+pm|prime minister|narendra modi|president of india|chief minister|"
    r"capital of|weather|crypto|bitcoin|cricket|ipl|bollywood|"
    r"movie|actor|actress|politics|election|stock market|tell me a joke|write code)\b",
    re.I,
)


def is_explicitly_off_topic(message: str) -> bool:
    return bool(_OFF_TOPIC_RE.search(message))


def is_on_topic(message: str, intents: set[str]) -> bool:
    if is_explicitly_off_topic(message):
        return False
    return True

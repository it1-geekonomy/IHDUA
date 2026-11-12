from __future__ import annotations

import re
from app.rag import constants as C

_GREETING_RE = re.compile(
    r"^(hi|hello|hey|greetings|namaste|vanakkam|good morning|good evening|good afternoon|hola)[\s!.]*$",
    re.I,
)
_THANKS_RE = re.compile(
    r"^(thanks|thank you|thankyou|thx|much appreciated|great job|awesome)[\s!.]*$",
    re.I,
)
_ACK_RE = re.compile(
    r"^(no|nope|nah|nothing|no thanks|no thank you|ok|okay|k|fine|cool|great|alright|got it|sure|yes|yeah|hmm+)[\s!.]*$",
    re.I,
)
_BYE_RE = re.compile(r"^(bye|goodbye|see you|tata|good night)[\s!.]*$", re.I)


def match_fast_intent(message: str) -> dict | None:
    """Only small talk is answered without retrieval; every factual answer comes from indexed content."""
    msg = message.strip()
    if _GREETING_RE.match(msg):
        return {"answer": C.GREETING_ANSWER, "sources": []}
    if _THANKS_RE.match(msg):
        return {"answer": C.THANKS_ANSWER, "sources": []}
    if _BYE_RE.match(msg):
        return {"answer": C.BYE_ANSWER, "sources": []}
    if _ACK_RE.match(msg):
        return {"answer": C.ACK_ANSWER, "sources": []}
    return None


_INTENT_PATTERNS: dict[str, re.Pattern] = {
    "donate": re.compile(
        r"\b(donate|donations?|80g|tax|taxes|tax-exempt|tax-exemption|501c|501\(c\)\(3\)|contribute|contributions?|funds?|receipts?)\b",
        re.I,
    ),
    "education": re.compile(
        r"\b(schools?|education|vinayaka|adarsha|krs|study|students?|teachers?|children)\b",
        re.I,
    ),
    "women": re.compile(
        r"\b(women|shg|shgs|self[\s-]*help|federations?|empowerment|women['s]?\s*savings)\b",
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
        r"\b(youth|nursing|gda|computers?|skills?|vocational|assistants?|general[\s-]*duty)\b",
        re.I,
    ),
    "governance": re.compile(
        r"\b(12a|12ab|80g|fcra|pan|trust[\s-]*deed|certificates?|downloads?|registration|form[\s-]*10ac|form[\s-]*10be)\b",
        re.I,
    ),
    "contact": re.compile(
        r"\b(contact|address|phones?|emails?|office|locations?|reach|hours|mysore|chicago)\b",
        re.I,
    ),
    "volunteer": re.compile(
        r"\b(volunteers?|volunteering|interns?|internships?|careers?|join|partner(s|ship|ships)?|collaborat\w*|csr|get\s+involved)\b",
        re.I,
    ),
    "leadership": re.compile(
        r"\b(founders?|chairpersons?|chairman|trustees?|leadership|leaders?|governance|board|team|director|ceo)\b",
        re.I,
    ),
    "about": re.compile(
        r"\b(about|mission|vision|values?|objectives?|aims?|ngo|non[\s-]*profit|who\s+(are|is)|what\s+is\s+ihdua|purpose)\b",
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

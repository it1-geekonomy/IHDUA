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
_CONTACT_RE = re.compile(
    r"^(contact|where is your office|office address|phone number|email address|how to contact|where are you located)[\s!?.]*$",
    re.I,
)
_DONATE_FAST_RE = re.compile(
    r"^(how to donate|donate|donation|i want to donate|give donation|how can i contribute)[\s!?.]*$",
    re.I,
)
def match_fast_intent(message: str) -> dict | None:
    msg = message.strip()
    if _GREETING_RE.match(msg):
        return {
            "answer": C.GREETING_ANSWER,
            "sources": [{"title": "About IHDUA", "url": C.ABOUT_URL}],
        }
    if _THANKS_RE.match(msg):
        return {
            "answer": C.THANKS_ANSWER,
            "sources": [],
        }
    if _CONTACT_RE.match(msg):
        return {
            "answer": C.CONTACT_ANSWER,
            "sources": [{"title": "Contact Us", "url": C.CONTACT_URL}],
        }
    if _DONATE_FAST_RE.match(msg):
        return {
            "answer": C.DONATE_INTENT_ANSWER,
            "sources": [{"title": "Donate Now", "url": C.DONATE_URL}],
        }
    return None


def detect_intents(text: str) -> set[str]:
    lower = text.lower()
    intents = set()

    if any(k in lower for k in ("donate", "donation", "80g", "tax", "501c", "contribute", "fund", "receipt")):
        intents.add("donate")

    if any(k in lower for k in ("school", "schools", "education", "vinayaka", "adarsha", "krs", "study", "student", "teacher", "children")):
        intents.add("education")

    if any(k in lower for k in ("women", "shg", "self help", "federation", "empowerment", "women savings")):
        intents.add("women")

    if any(k in lower for k in ("microfinance", "loan", "loans", "credit", "bank linkage", "interest")):
        intents.add("microfinance")

    if any(k in lower for k in ("stitching", "garment", "tailor", "tailoring", "sewing")):
        intents.add("stitching")

    if any(k in lower for k in ("health", "camp", "camps", "doctor", "medical", "eye", "checkup", "clinic", "cancer")):
        intents.add("health")

    if any(k in lower for k in ("model village", "green cover", "tree", "plant", "afforestation", "rejuvenation", "sanitation", "solar")):
        intents.add("model_village")

    if any(k in lower for k in ("youth", "farmer", "farmers", "agriculture", "nursing", "gda", "computer")):
        intents.add("skills")

    if any(k in lower for k in ("contact", "address", "phone", "email", "office", "location", "reach", "hours", "mysore", "chicago")):
        intents.add("contact")

    if any(k in lower for k in ("volunteer", "intern", "internship", "career", "join")):
        intents.add("volunteer")

    if any(k in lower for k in ("ajaikumar", "founder", "chairperson", "trustee", "leadership", "leader", "trustees", "governance", "board")):
        intents.add("leadership")

    if any(k in lower for k in ("shanthamma", "ripple effect", "story", "stories", "blog", "blogs", "beneficiary", "field story")):
        intents.add("stories")

    return intents


_OFF_TOPIC_RE = re.compile(
    r"\b(pm of india|prime minister|narendra modi|president of india|chief minister|"
    r"capital of|weather|crypto|bitcoin|cricket|ipl|bollywood|"
    r"movie|actor|actress|politics|election|stock market)\b",
    re.I,
)


def is_explicitly_off_topic(message: str) -> bool:
    return bool(_OFF_TOPIC_RE.search(message))


def is_on_topic(message: str, intents: set[str]) -> bool:
    if is_explicitly_off_topic(message):
        return False
    return True

import re

_FOLLOW_UP_RE = re.compile(
    r"\b(it|that|this|them|these|those|one|more|second|first|third|last|another|in that|about it|any one|tell me one|explain one|give me one)\b",
    re.I,
)


_CONTINUATION_RE = re.compile(
    r"^(then|and|and then|so|more|what else|tell me more|more details|go on|continue|next|explain more|elaborate)[\s?!.]*$",
    re.I,
)


def last_turn(history: list[dict], role: str) -> str:
    return next((m["content"] for m in reversed(history) if m.get("role") == role), "")


def is_continuation(query: str) -> bool:
    return bool(_CONTINUATION_RE.match(query.strip()))


def rewrite_query(query: str, history: list[dict], unanswered: str = "") -> str:
    if not history:
        return query

    words = query.strip().split()
    if len(words) > 8 or not _FOLLOW_UP_RE.search(query):
        return query

    last_user = last_turn(history, "user")
    last_assistant = last_turn(history, "assistant")
    # A previous question the bot couldn't answer is no useful context.
    if unanswered and last_assistant.strip() == unanswered.strip():
        return query

    additions = []
    if last_user:
        additions.append(last_user)

    # Extract specific entity if user refers to an ordinal like 'second one', '1st', etc.
    low = query.lower()
    if any(ord_word in low for ord_word in ("first", "second", "third", "last", "1st", "2nd", "3rd")):
        clean_assistant = last_assistant.replace("*", "")
        numbered = re.findall(r"(?:^|\n)\s*\d+[.)]\s*([^\n:]+)", clean_assistant)
        bullets = re.findall(r"(?:^|\n)\s*[-•]\s*([^\n:]+)", clean_assistant)
        items = numbered if numbered else bullets

        if items:
            idx = 0
            if "second" in low or "2nd" in low:
                idx = 1
            elif "third" in low or "3rd" in low:
                idx = 2
            elif "last" in low:
                idx = len(items) - 1

            if 0 <= idx < len(items):
                target = items[idx].split(":")[0].split("–")[0].split("—")[0].strip()
                if target:
                    additions.append(target)

    if additions:
        return f"{' '.join(additions)} {query}"

    return query


def build_multi_queries(query: str, intents: set[str], original: str = "") -> list[str]:
    queries = [query]
    base = (original or query).strip()
    if base and base.lower() != query.lower():
        queries.append(base)
    if base and "ihdua" not in base.lower():
        queries.append(f"IHDUA {base}")

    if "about" in intents:
        queries.append("About IHDUA who we are mission vision core values non-profit organisation")
    if "leadership" in intents:
        queries.append("IHDUA leadership team founder chairperson trustees members designation")
    if "impact" in intents:
        queries.append("IHDUA impact numbers statistics villages reached people trained")
    if "history" in intents:
        queries.append("IHDUA milestones history journey by year annual reports")
    if "stories" in intents:
        queries.append("IHDUA blogs field stories articles")
    if "education" in intents:
        queries.append("Vinayaka Jnana Vidyashale Mysore Adarsha Academy KRS school education")
    if "women" in intents or "microfinance" in intents:
        queries.append("Self-help groups SHG federation microfinance women empowerment loans")
    if "stitching" in intents:
        queries.append("Stitching unit garment tailoring vocational training women")
    if "farmers" in intents:
        queries.append("Farmers sustainable agriculture organic farming soil health green maize fodder")
    if "skills" in intents:
        queries.append("Youth skills computer training General Duty Assistant GDA nursing care vocational")
    if "governance" in intents:
        queries.append("12A 80G FCRA registration certificate URN AY 2022-23 to AY 2026-27 Form 10AC Form 10BE Trust Deed")
    if "health" in intents:
        queries.append("Free medical camps healthcare doctor awareness diagnostics")
    if "donate" in intents:
        queries.append("How to donate online 80G tax benefit receipt recurring donation")
    if "model_village" in intents:
        queries.append("Model village rejuvenation increase the green cover tree plantation sanitation")
    if "contact" in intents:
        queries.append("IHDUA contact us office address phone email location")
    if "volunteer" in intents:
        queries.append("Get involved with IHDUA become a volunteer partner with us CSR collaboration")

    return list(dict.fromkeys(queries))[:5]

import re

_FOLLOW_UP_RE = re.compile(
    r"\b(it|that|this|them|these|those|one|more|second|first|third|last|another|in that|about it|any one|tell me one|explain one|give me one)\b",
    re.I,
)


def rewrite_query(query: str, history: list[dict]) -> str:
    if not history:
        return query

    words = query.strip().split()
    is_follow_up = (len(words) <= 8 and bool(_FOLLOW_UP_RE.search(query))) or (len(words) < 4)
    if not is_follow_up:
        return query

    last_user = next((m["content"] for m in reversed(history) if m.get("role") == "user"), "")
    last_assistant = next((m["content"] for m in reversed(history) if m.get("role") == "assistant"), "")

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


def build_multi_queries(query: str, intents: set[str]) -> list[str]:
    queries = [query]

    if "leadership" in intents:
        queries.append("Dr B.S. Ajaikumar founder chairperson Bhagya Ajaikumar trustee leadership")
    if "stories" in intents:
        queries.append("Listening to Build Stronger Villages The Ripple Effect Shanthamma field stories blog")
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
        queries.append("Online donation 80G tax exemption 501c3 receipt deduction")
    if "model_village" in intents:
        queries.append("Model village rejuvenation increase the green cover tree plantation sanitation")
    if "contact" in intents:
        queries.append("IHDUA office address phone email Mysore Chicago hours location")

    return queries[:3]

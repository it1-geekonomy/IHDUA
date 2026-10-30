import re

_FOLLOW_UP_RE = re.compile(
    r"\b(it|that|this|them|these|those|one|more|in that|about it|any one|tell me one|explain one|give me one)\b",
    re.I,
)


def rewrite_query(query: str, history: list[dict]) -> str:
    if not history:
        return query

    # If the user asks a follow-up or short pronoun question like "explain any one in that", "tell me more about it"
    last_user = next((m["content"] for m in reversed(history) if m["role"] == "user"), "")
    words = query.strip().split()
    if (len(words) <= 6 and _FOLLOW_UP_RE.search(query)) or (len(words) < 4):
        if last_user:
            return f"{last_user} {query}"
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
    if "health" in intents:
        queries.append("Free medical camps healthcare doctor awareness diagnostics")
    if "donate" in intents:
        queries.append("Online donation 80G tax exemption 501c3 receipt deduction")
    if "model_village" in intents:
        queries.append("Model village rejuvenation increase the green cover tree plantation sanitation")
    if "contact" in intents:
        queries.append("IHDUA office address phone email Mysore Chicago hours location")

    return queries[:3]

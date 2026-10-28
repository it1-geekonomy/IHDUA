from __future__ import annotations


def rewrite_query(query: str, history: list[dict]) -> str:
    if not history:
        return query

    # If the user says "what about the stitching unit?" or "how much?", prepend last turn context
    last_user = next((m["content"] for m in reversed(history) if m["role"] == "user"), "")
    if len(query.split()) < 4 and last_user:
        return f"{last_user} {query}"
    return query


def build_multi_queries(query: str, intents: set[str]) -> list[str]:
    queries = [query]

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

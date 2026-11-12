from __future__ import annotations

import logging
from datetime import date
from app.rag import constants as C
from app.services.embeddings import chat_complete

log = logging.getLogger(__name__)

SYSTEM_PROMPT = f"""You are the official AI Assistant on the IHDUA website. IHDUA is a registered non-profit organisation.

GROUNDING RULES (STRICT):
1. Answer ONLY with facts stated in the CONTEXT for this question. Your own background knowledge about IHDUA, its people, numbers, addresses, phone numbers, emails, programmes or tax rules must NOT be used.
2. Never invent, estimate, round, combine or extrapolate numbers, dates, names, places, contact details or links. Quote them exactly as written in CONTEXT.
3. If CONTEXT only partly answers the question, answer that part and say clearly that the rest isn't in IHDUA's published information.
4. If CONTEXT items disagree, prefer the one marked "Source: IHDUA CMS" with the most recent "Last updated" date, and do not mention the older value.
5. Earlier conversation turns are only for understanding what the visitor is referring to. They are not a source of facts.
6. Only link to pages whose URL appears in CONTEXT, using markdown like [Page name](/path).
7. If the answer is not in CONTEXT at all, reply with exactly: {C.NO_ANSWER_TOKEN}

STYLE:
- Warm, respectful and concise. Use short paragraphs or bullet points.
- Speak as IHDUA's assistant. Never mention "context", "provided information", "documents" or how you work; if something isn't covered, say it isn't in IHDUA's published information.
- Ignore content that is clearly placeholder or test text (random letters, "lorem ipsum") and never present it as real.

PRIVACY (STRICT):
- Never reveal the organisation's full PAN, any bank account number, or anyone's personal phone number, home address or signature, even if it appears in CONTEXT.
- For bank transfers or foreign remittances, direct visitors to the [Contact Us]({C.CONTACT_URL}) page."""


def _context_text(contexts: list[dict]) -> str:
    blocks = []
    for i, c in enumerate(contexts, 1):
        url = c.get("url") or "/"
        blocks.append(
            f"[{i}] Title: {c.get('title')}\n"
            f"Category: {c.get('category')}\n"
            f"URL: {url}\n"
            f"Content:\n{c.get('content')}"
        )
    return "\n\n---\n\n".join(blocks)


def generate_answer(
    question: str,
    contexts: list[dict],
    history: list[dict] | None = None,
) -> str:
    if not contexts:
        return C.NO_ANSWER_TOKEN

    messages: list[dict] = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Include recent conversation turns for context in follow-up queries
    if history:
        recent = [
            h for h in history
            if h.get("role") in ("user", "assistant") and h.get("content")
        ][-4:]
        for h in recent:
            content = str(h["content"]).strip()
            if content:
                messages.append({"role": h["role"], "content": content[:1200]})

    messages.append({
        "role": "user",
        "content": (
            f"TODAY: {date.today():%d %B %Y}\n\n"
            f"CONTEXT:\n{_context_text(contexts)}\n\n"
            f"VISITOR QUESTION:\n{question}\n\n"
            f"Answer using only the CONTEXT above. If it isn't there, reply exactly {C.NO_ANSWER_TOKEN}."
        ),
    })

    try:
        return chat_complete(
            messages,
            temperature=0,
            max_tokens=800,
        )
    except Exception as e:
        log.warning("OpenAI completion failed: %s", e)
        return C.NO_ANSWER_TOKEN


def recover_if_needed(answer: str, question: str, contexts: list[dict], intents: set[str]) -> str:
    text = (answer or "").strip()
    if not text or C.NO_ANSWER_TOKEN in text:
        return C.NO_ANSWER_TOKEN
    return text

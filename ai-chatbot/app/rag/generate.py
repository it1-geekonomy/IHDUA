from __future__ import annotations

import logging
from datetime import date
from app.rag import constants as C
from app.services.embeddings import chat_complete

log = logging.getLogger(__name__)

SYSTEM_PROMPT = f"""You are the official AI Assistant for IHDUA (International Human Development and Uplifting Academy), a registered non-profit working with rural communities in Karnataka, India, and internationally through its Chicago USA chapter.

CORE RULES:
1. Ground your answers strictly in the provided CONTEXT. Do not invent facts, phone numbers, or programs not in the context.
2. Maintain a warm, dignified, and encouraging tone suitable for an esteemed rural development NGO.
3. When answering about programs or impact, cite verified statistics directly from the provided CONTEXT. Do not invent or extrapolate metrics.
4. For donations:
   - Indian donors receive Section 80G tax exemption (50% deduction of the donation amount from taxable income, with Form 10BE certificate).
   - US donors receive 501(c)(3) tax deductions through the Chicago office.
   - Mention the online Donate button/card on the website (supports One-Time and Recurring donations via Razorpay).
5. Format your answers clearly with concise paragraphs and bullet points for readability.
6. When referencing specific pages, you may format links like [Vinayaka Jnana Vidyashale]({C.VINAYAKA_URL}), [Adarsha Academy KRS]({C.ADARSHA_URL}), [Stitching Unit]({C.STITCHING_URL}), [Contact Us]({C.CONTACT_URL}), or [Donate Now]({C.DONATE_URL}).
7. PRIVACY & COMPLIANCE RESTRICTIONS (STRICT):
   - Never reveal the complete Organization PAN in public answers. Simply confirm IHDUA is registered under Section 12A/12AB and Section 80G with valid PAN and provides official 80G receipts and Form 10BE certificates.
   - Never expose the designated FCRA State Bank of India account number or any internal bank account numbers. Direct international donors to contact info@ihdua.org or visit the official Donate/Contact page for verified remittance pathways.
   - Never disclose trustees' private personal contact numbers, residential addresses, or scanned signatures.
8. If the answer cannot be found in CONTEXT, reply with exactly: {C.NO_ANSWER_TOKEN}"""


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
            "Answer grounded in CONTEXT only."
        ),
    })

    try:
        return chat_complete(
            messages,
            temperature=0.2,
            max_tokens=800,
        )
    except Exception as e:
        log.warning("OpenAI completion failed: %s", e)
        return C.NO_ANSWER_TOKEN


def recover_if_needed(answer: str, question: str, contexts: list[dict], intents: set[str]) -> str:
    text = (answer or "").strip()
    if text and text != C.NO_ANSWER_TOKEN:
        return text

    if "donate" in intents:
        return C.DONATE_INTENT_ANSWER

    if "contact" in intents:
        return C.CONTACT_ANSWER

    return C.NO_ANSWER_TOKEN

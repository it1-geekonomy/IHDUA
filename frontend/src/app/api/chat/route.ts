import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_TURNS = 6;
const MAX_TURN_CHARS = 4000;

const UNAVAILABLE_RESPONSE = {
  reply:
    "Sorry, the IHDUA assistant is temporarily unavailable. Please try again in a few minutes, or reach the IHDUA team through the Contact Us page.",
  sources: [],
  actions: [{ label: "Contact Us", href: "/contact", action: "navigate" as const }],
};

type HistoryTurn = { role: "user" | "assistant"; content: string };

function sanitizeHistory(raw: unknown): HistoryTurn[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  return raw
    .filter(
      (t): t is HistoryTurn =>
        !!t &&
        (t.role === "user" || t.role === "assistant") &&
        typeof t.content === "string" &&
        t.content.trim().length > 0,
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_TURN_CHARS) }));
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    ""
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === "string" ? body.message : "";

    if (!message.trim()) {
      return NextResponse.json(
        {
          reply: "Please provide a question or message so I can assist you with information about IHDUA.",
          sources: [],
          actions: [],
          suggestedFollowUps: [
            "What programs does IHDUA run?",
            "How can I donate with 80G tax benefit?",
            "Where is the IHDUA office located?",
          ],
        },
        { status: 400 },
      );
    }

    // Connect to Python FastAPI RAG microservice on port 8001 (or CHATBOT_SERVICE_URL)
    const externalServiceUrl =
      process.env.CHATBOT_SERVICE_URL || "http://localhost:8001";
    const internalApiKey =
      process.env.AI_SERVICE_INTERNAL_KEY ||
      process.env.INTERNAL_API_KEY ||
      "";

    try {
      const extRes = await fetch(`${externalServiceUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Api-Key": internalApiKey,
          ...(clientIp(req) ? { "X-Forwarded-For": clientIp(req) } : {}),
        },
        body: JSON.stringify({
          message: message.trim().slice(0, MAX_MESSAGE_CHARS),
          session_id: typeof body.session_id === "string" ? body.session_id : undefined,
          history: sanitizeHistory(body.history),
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (extRes.ok) {
        const extData = await extRes.json();
        const rawAnswer = extData.answer || extData.reply;
        if (typeof rawAnswer === "string" && rawAnswer.trim()) {
          const sources = Array.isArray(extData.sources)
            ? extData.sources.map((s: { title?: string; url?: string } | string) =>
                typeof s === "string"
                  ? { title: s, url: "/about" }
                  : { title: s.title || "IHDUA", url: s.url || "/about" },
              )
            : [];

          // Generate contextual quick action buttons based on content/urls
          const actions = [];
          if (rawAnswer.toLowerCase().includes("donate") || rawAnswer.toLowerCase().includes("80g")) {
            actions.push({ label: "Donate Online (80G)", href: "/#donate", action: "donate" as const });
          }
          if (rawAnswer.toLowerCase().includes("vidyashale")) {
            actions.push({ label: "Vinayaka Vidyashale", href: "/vinayakagnana-vidyashale-mysore", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("adarsha")) {
            actions.push({ label: "Adarsha Academy KRS", href: "/adarsha-academy-krs", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("stitching")) {
            actions.push({ label: "Stitching Unit", href: "/stitching-unit", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("farmer")) {
            actions.push({ label: "Farmers Support", href: "/farmers", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("youth")) {
            actions.push({ label: "Youth Programs", href: "/youth", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("green cover") || rawAnswer.toLowerCase().includes("village")) {
            actions.push({ label: "Model Village", href: "/model-village", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("medical") || rawAnswer.toLowerCase().includes("health camp")) {
            actions.push({ label: "Health Camps", href: "/health-camps", action: "navigate" as const });
          }
          if (rawAnswer.toLowerCase().includes("contact") || rawAnswer.toLowerCase().includes("mysore")) {
            actions.push({ label: "Contact Us", href: "/contact", action: "navigate" as const });
          }

          return NextResponse.json({
            reply: rawAnswer,
            sources,
            session_id: extData.session_id,
            actions: actions.slice(0, 3),
            suggestedFollowUps: [
              "Tell me about the schools in Mysore and KRS",
              "How do donations qualify for 80G tax exemption?",
              "Where is the IHDUA office located?",
            ],
          });
        }
      }
      if (extRes.status === 429) {
        return NextResponse.json(
          {
            ...UNAVAILABLE_RESPONSE,
            reply: "You're sending messages a little too quickly. Please wait a moment and try again.",
            actions: [],
          },
          { status: 429 },
        );
      }
      console.error(`Chatbot service responded with HTTP ${extRes.status}`);
    } catch (error) {
      console.error("Chatbot service unreachable:", error);
    }

    return NextResponse.json(UNAVAILABLE_RESPONSE, { status: 503 });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(UNAVAILABLE_RESPONSE, { status: 500 });
  }
}

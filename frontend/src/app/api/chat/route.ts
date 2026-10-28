import { NextRequest, NextResponse } from "next/server";
import { queryKnowledgeBase } from "@/shared/components/chatbot/ragEngine";

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
      process.env.AI_SERVICE_INTERNAL_KEY || "replace-with-a-long-random-secret";

    try {
      const extRes = await fetch(`${externalServiceUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Api-Key": internalApiKey,
        },
        body: JSON.stringify({ message, session_id: body.session_id }),
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
    } catch {
      // Fall through smoothly to built-in knowledge base RAG engine
    }

    // Grounded RAG query from IHDUA Knowledge Base
    const result = queryKnowledgeBase(message);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "I apologize, but I encountered an error processing your request. Please try asking again or reach out to us at info@ihdua.org.",
        sources: ["IHDUA Support"],
        actions: [{ label: "Contact Us", href: "/contact", action: "navigate" }],
      },
      { status: 500 },
    );
  }
}

import { KNOWLEDGE_BASE } from "./knowledgeBase";
import { ActionButton, ChatResponse, KnowledgeDocument } from "./types";

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are",
  "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both",
  "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt",
  "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt",
  "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres",
  "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if",
  "in", "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt",
  "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
  "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes",
  "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs",
  "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre",
  "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt",
  "we", "wed", "well", "were", "werent", "weve", "what", "whats", "when", "whens", "where", "wheres",
  "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you",
  "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves", "tell", "give", "know",
  "please", "can", "want", "like"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function extractBigrams(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const bigrams: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.push(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

export function queryKnowledgeBase(userQuery: string): ChatResponse {
  const trimmed = userQuery.trim().toLowerCase();

  // 1. Check for casual greetings
  const greetingRegex = /^(hi|hello|hey|namaste|vanakkam|good morning|good evening|good afternoon|greetings|hola)(\s.*)?$/i;
  if (greetingRegex.test(trimmed) && trimmed.length < 25) {
    return {
      reply:
        "Hello! 👋 Welcome to **IHDUA (International Human Development and Uplifting Academy)**.\n\nI am your official **AI Knowledge Assistant**, equipped with complete information about our grassroots community programs, impact, and operations. How can I assist you today?",
      sources: ["IHDUA Official Knowledge Base"],
      actions: [
        { label: "🎓 Our Schools & Education", href: "/education", action: "navigate" },
        { label: "👩 Women SHGs & Microfinance", href: "/women-empowerment", action: "navigate" },
        { label: "❤️ Donate (80G Tax Exemption)", href: "/#donate", action: "donate" },
      ],
      suggestedFollowUps: [
        "Tell me about your schools in Mysore and KRS",
        "How do donations qualify for 80G tax exemption?",
        "Where are IHDUA's offices located?",
      ],
    };
  }

  // 2. Check for thanks/gratitude
  const thanksRegex = /^(thanks|thank you|thankyou|thx|appreciate it|awesome|great|good job)[\s!.]*$/i;
  if (thanksRegex.test(trimmed)) {
    return {
      reply:
        "You're very welcome! 😊 Feel free to ask if you need more details about our educational institutions, women empowerment collectives, or ways to get involved.",
      sources: ["IHDUA Knowledge Base"],
      actions: [
        { label: "Support Our Mission", href: "/#donate", action: "donate" },
        { label: "Contact Us", href: "/contact", action: "navigate" },
      ],
      suggestedFollowUps: [
        "How can I volunteer with IHDUA?",
        "What are IHDUA's latest impact numbers?",
      ],
    };
  }

  // 3. Check for off-topic queries upfront
  const offTopicPatterns = [
    /\b(pm of india|prime minister|narendra modi|president of india|chief minister)\b/i,
    /\b(who is madhu|what is hcg|capital of|weather|crypto|bitcoin|cricket|ipl|bollywood|movie|actor|actress|politics)\b/i,
  ];
  if (offTopicPatterns.some((pattern) => pattern.test(trimmed))) {
    return {
      reply:
        "I am here to help with questions about **IHDUA (International Human Development and Uplifting Academy)** and its rural development initiatives.\n\nYou can ask me about our **rural schools (Vinayaka Vidyashale & Adarsha Academy)**, **women Self-Help Groups**, **microfinance**, the **Stitching Unit**, **free health camps**, or **80G tax-exempt donations**.",
      sources: [],
      actions: [
        { label: "Our Programs", href: "/#our-impact", action: "navigate" },
        { label: "Donate Online (80G)", href: "/#donate", action: "donate" },
        { label: "Contact Us", href: "/contact", action: "navigate" },
      ],
      suggestedFollowUps: [
        "What education programs do you run?",
        "How does IHDUA empower women?",
        "How can I donate with 80G tax benefit?",
      ],
    };
  }

  // 4. Extract tokens and bigrams for RAG retrieval
  const queryTokens = tokenize(userQuery);
  const queryBigrams = extractBigrams(userQuery);

  const domainWords = [
    "ihdua", "academy", "vidyashale", "adarsha", "krs", "school", "education", "student", "teacher",
    "women", "shg", "federation", "microfinance", "credit", "loan", "stitching", "garment",
    "tailor", "sewing", "health", "camp", "medical", "checkup", "clinic", "cancer", "model village",
    "green cover", "tree", "plant", "donate", "donation", "80g", "tax", "volunteer", "intern",
    "contact", "office", "mysore", "chicago", "rural", "ngo", "programs", "impact", "empowerment",
    "ajaikumar", "founder", "chairperson", "trustee", "leadership", "shanthamma", "story", "stories", "blog", "blogs"
  ];
  const hasDomainWord = domainWords.some((w) => trimmed.includes(w));

  // Score each document
  interface ScoredDoc {
    doc: KnowledgeDocument;
    score: number;
    matchReasons: string[];
  }

  const scoredDocs: ScoredDoc[] = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    const matchReasons: string[] = [];

    // Title score (high weight)
    const titleTokens = tokenize(doc.title);
    for (const qToken of queryTokens) {
      if (titleTokens.includes(qToken)) {
        score += 8;
        matchReasons.push(`Title match: "${qToken}"`);
      }
    }

    // Keyword score
    for (const kw of doc.keywords) {
      const lowerKw = kw.toLowerCase();
      if (trimmed.includes(lowerKw)) {
        score += 10;
        matchReasons.push(`Exact keyword: "${kw}"`);
      } else {
        const kwTokens = tokenize(kw);
        for (const qToken of queryTokens) {
          if (kwTokens.includes(qToken)) {
            score += 4;
          }
        }
      }
    }

    // Bigram match against summary and content
    const docText = `${doc.title} ${doc.summary} ${doc.content}`.toLowerCase();
    for (const bg of queryBigrams) {
      if (docText.includes(bg)) {
        score += 6;
      }
    }

    // Single token frequency match
    for (const qToken of queryTokens) {
      if (doc.summary.toLowerCase().includes(qToken)) score += 2;
      if (doc.content.toLowerCase().includes(qToken)) score += 1;
    }

    return { doc, score, matchReasons };
  });

  // Sort descending by relevance score
  scoredDocs.sort((a, b) => b.score - a.score);

  const topMatch = scoredDocs[0];

  // If score is high enough and is on-topic, return a rich grounded answer
  if (topMatch && topMatch.score >= 8 && hasDomainWord) {
    const primary = topMatch.doc;
    const secondary = scoredDocs[1]?.score >= 10 ? scoredDocs[1].doc : null;

    let responseText = `### ${primary.title}\n\n${primary.content}`;

    if (secondary && secondary.id !== primary.id) {
      responseText += `\n\n---\n**Related: ${secondary.title}**\n${secondary.summary}`;
    }

    // Combine actions & suggested follow-ups
    const actions: ActionButton[] = [...(primary.actions ?? [])];
    if (secondary?.actions) {
      for (const act of secondary.actions) {
        if (!actions.some((a) => a.label === act.label)) {
          actions.push(act);
        }
      }
    }

    const followUps = [
      ...(primary.suggestedFollowUps ?? []),
      ...(secondary?.suggestedFollowUps ?? []),
    ].slice(0, 3);

    return {
      reply: responseText,
      sources: [
        { title: primary.title, url: primary.url || "/about" },
        ...(secondary ? [{ title: secondary.title, url: secondary.url || "/about" }] : []),
      ],
      actions: actions.slice(0, 3),
      suggestedFollowUps: followUps,
    };
  }

  // 5. Fallback when query is ambiguous or out of scope
  return {
    reply:
      "I am here to help with questions about **IHDUA (International Human Development and Uplifting Academy)** and its rural development programs.\n\nYou can ask me about:\n" +
      "• **Education & Schools:** Vinayaka Jnana Vidyashale (Mysore) & Adarsha Academy (KRS)\n" +
      "• **Women Empowerment:** 697+ Self-Help Groups, 18 Federations & Stitching Unit\n" +
      "• **Microfinance:** ₹9.14+ Cr loans and credit linkages for rural women\n" +
      "• **Healthcare:** 28+ Free rural medical camps & health awareness\n" +
      "• **Model Village:** Gram Swaraj rejuvenation & Increase the Green Cover drives\n" +
      "• **Donations:** 80G (India 50% tax deduction) and 501(c)(3) (USA tax deduction)\n\n" +
      "For official inquiries, contact info@ihdua.org or call +91 821 248 1234.",
    sources: [],
    actions: [
      { label: "View Our Programs", href: "/#our-impact", action: "navigate" },
      { label: "Donate (80G Tax Exemption)", href: "/#donate", action: "donate" },
      { label: "Contact Offices", href: "/contact", action: "navigate" },
    ],
    suggestedFollowUps: [
      "What education programs do you run?",
      "How does IHDUA empower women?",
      "How can I donate with 80G tax benefit?",
    ],
  };
}

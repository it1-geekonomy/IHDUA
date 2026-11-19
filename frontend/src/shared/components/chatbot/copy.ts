import type { LanguageCode } from "@/utils/languageHelper";
import { LANGUAGES } from "@/utils/languageHelper";

export type WelcomeSuggestion = {
  id: string;
  icon: string;
  /** Shown in the UI */
  label: string;
  /** Sent to RAG (English) for reliable retrieval */
  query: string;
};

const SUGGESTIONS_EN: WelcomeSuggestion[] = [
  {
    id: "support",
    icon: "❤️",
    label: "How can I support IHDUA?",
    query: "How can I support IHDUA?",
  },
  {
    id: "programmes",
    icon: "🧰",
    label: "What programmes do you run?",
    query: "What programmes do you run?",
  },
  {
    id: "partner",
    icon: "🌾",
    label: "How can I partner with IHDUA?",
    query: "How can I partner with IHDUA?",
  },
  {
    id: "location",
    icon: "📍",
    label: "Where can I find you?",
    query: "Where can I find you?",
  },
];

const SUGGESTIONS_KN: WelcomeSuggestion[] = [
  {
    id: "support",
    icon: "❤️",
    label: "ನಾನು ಐಎಚ್‌ಡಿಯುಎಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
    query: "How can I support IHDUA?",
  },
  {
    id: "programmes",
    icon: "🧰",
    label: "ನೀವು ಯಾವ ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ನಡೆಸುತ್ತೀರಿ?",
    query: "What programmes do you run?",
  },
  {
    id: "partner",
    icon: "🌾",
    label: "ಐಎಚ್‌ಡಿಯುಎ ಜೊತೆ ಹೇಗೆ ಪಾಲುದಾರಿಕೆ ಮಾಡಬಹುದು?",
    query: "How can I partner with IHDUA?",
  },
  {
    id: "location",
    icon: "📍",
    label: "ನಿಮ್ಮನ್ನು ಎಲ್ಲಿ ಕಾಣಬಹುದು?",
    query: "Where can I find you?",
  },
];

export function chatbotCopy(language: LanguageCode) {
  const kn = language === LANGUAGES.KANNADA;
  return {
    language: kn ? ("kn" as const) : ("en" as const),
    title: kn ? "AI ಸಹಾಯಕ" : "AI Assistant",
    online: kn ? "ಆನ್‌ಲೈನ್" : "Online",
    emptyGreeting: kn
      ? "ನಮಸ್ಕಾರ! ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? 👋"
      : "Namaste! How can we help you? 👋",
    greeting: kn
      ? "ನಮಸ್ಕಾರ! ಐಎಚ್‌ಡಿಯುಎಗೆ ಸ್ವಾಗತ.\nನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
      : "Namaste! Welcome to IHDUA.\nHow can I help you today?",
    placeholder: kn ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ..." : "Type your message...",
    send: kn ? "ಕಳುಹಿಸಿ" : "Send message",
    reset: kn ? "ಹೊಸ ಸಂಭಾಷಣೆ" : "New conversation",
    close: kn ? "ಮುಚ್ಚಿ" : "Close chat",
    open: kn ? "ಐಎಚ್‌ಡಿಯುಎ AI ಸಹಾಯಕ ತೆರೆಯಿರಿ" : "Open IHDUA AI Assistant",
    teaserBefore: kn ? "" : "How can ",
    teaserBrand: kn ? "ಐಎಚ್‌ಡಿಯುಎ" : "IHDUA",
    teaserAfter: kn ? " ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? 👋" : " help? 👋",
    unreachable: kn
      ? "ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಸಂಪರ್ಕ ಪುಟಕ್ಕೆ ಭೇಟಿ ನೀಡಿ."
      : "I could not reach the server right now. Please try again in a moment or visit our Contact page.",
    noAnswer: kn
      ? "ಉತ್ತರ ಸಿಗಲಿಲ್ಲ. ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ನಮ್ಮ ಸಂಪರ್ಕ ಪುಟವನ್ನು ನೋಡಿ."
      : "I could not find an answer. Please check our Contact page for more information.",
    suggestions: kn ? SUGGESTIONS_KN : SUGGESTIONS_EN,
  };
}

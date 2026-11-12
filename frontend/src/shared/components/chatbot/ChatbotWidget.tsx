"use client";

import {
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  RotateCcw,
  Send,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { scrollToDonateSection } from "@/domains/home/lib/donation";
import { isHomePath } from "@/shared/lib/path";

type ChatRole = "bot" | "user";

type ChatSource = {
  title: string;
  url: string;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  at: number;
  sources?: ChatSource[];
  retryQuestion?: string;
};

const STORAGE_KEY = "ihdua-chat-v1";
const TEASER_KEY = "ihdua-chat-teaser-dismissed";
const GREETING = "Namaste! Welcome to IHDUA.\nHow can I help you today?";
const MAX_MESSAGE_LENGTH = 1000;

const WELCOME_SUGGESTIONS = [
  {
    id: "support",
    label: "How can I support IHDUA?",
    icon: "❤️",
  },
  {
    id: "programmes",
    label: "What programmes do you run?",
    icon: "🧰",
  },
  {
    id: "partner",
    label: "How can I partner with IHDUA?",
    icon: "🌾",
  },
  {
    id: "location",
    label: "Where can I find you?",
    icon: "📍",
  },
];

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatTime(at: number) {
  return new Date(at)
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .toLowerCase();
}

function isInternalUrl(url: string) {
  if (url.startsWith("/") || url.startsWith("#")) return true;
  if (typeof window === "undefined") return false;
  try {
    return new URL(url).host === window.location.host;
  } catch {
    return false;
  }
}

function SmartLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "font-semibold text-[#9739A8] underline decoration-[#FFD638] decoration-2 underline-offset-2 hover:text-[#722280]";

  if (
    href === "#donate" ||
    href === "/#donate" ||
    href === "#cta-donate" ||
    href === "/#cta-donate"
  ) {
    return (
      <button
        type="button"
        data-scroll-to="donate"
        className={`${className} cursor-pointer`}
      >
        {children}
      </button>
    );
  }

  if (isInternalUrl(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}

const INLINE_PATTERN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  INLINE_PATTERN.lastIndex = 0;

  while ((match = INLINE_PATTERN.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${match.index}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-[#00191B]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("[")) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/) ?? [];
      nodes.push(
        <SmartLink key={key} href={href ?? "#"}>
          {label ?? token}
        </SmartLink>,
      );
    } else if (token.includes("@") && !token.startsWith("http")) {
      nodes.push(
        <SmartLink key={key} href={`mailto:${token}`}>
          {token}
        </SmartLink>,
      );
    } else {
      nodes.push(
        <SmartLink key={key} href={token}>
          {token.replace(/^https?:\/\/(www\.)?/, "")}
        </SmartLink>,
      );
    }
    last = match.index + token.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function FormattedText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushList = (key: string) => {
    if (!list) return;
    const items = list.items.map((item, i) => (
      <li key={`${key}-${i}`} className="pl-0.5">
        {renderInline(item, `${key}-${i}`)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol
          key={key}
          className="list-decimal space-y-1 pl-4 marker:font-semibold marker:text-[#9739A8]"
        >
          {items}
        </ol>
      ) : (
        <ul key={key} className="list-disc space-y-1 pl-4 marker:text-[#9739A8]">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);

    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (list && list.ordered !== ordered) flushList(`list-${i}`);
      if (!list) list = { ordered, items: [] };
      list.items.push((bullet ?? numbered)![1]);
      return;
    }

    flushList(`list-${i}`);
    if (!line) return;
    const heading = line.match(/^#{1,4}\s+(.*)$/);
    blocks.push(
      <p
        key={`p-${i}`}
        className={heading ? "font-semibold text-[#00191B]" : undefined}
      >
        {renderInline(heading ? heading[1] : line, `p-${i}`)}
      </p>,
    );
  });
  flushList("list-end");

  return <div className="space-y-2">{blocks}</div>;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative size-7 shrink-0 rounded-full overflow-hidden">
        <Image
          src="/chatbot/chatbot-icon.png"
          alt="Ai Assistant"
          width={28}
          height={28}
          className="size-full object-cover"
        />
      </div>
      <div
        className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-[#E5DDF3] bg-white px-3.5 py-2.5 shadow-xs"
        aria-label="Ai Assistant is typing"
      >
        {[4, 6, 4].map((dot, i) => (
          <motion.span
            key={i}
            className="rounded-full bg-[#9739A8]"
            style={{ width: dot, height: dot }}
            animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showTeaser, setShowTeaser] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoredRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(TEASER_KEY)) return;
    const timer = window.setTimeout(() => setShowTeaser(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, sessionId }),
      );
    } catch {
      // ignore
    }
  }, [messages, sessionId]);

  function restoreChat() {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw);
      setMessages(stored.messages ?? []);
      setSessionId(stored.sessionId);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dismissTeaser = useCallback(() => {
    setShowTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      // ignore
    }
  }, []);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setInput("");
    dismissTeaser();

    const now = Date.now();
    setMessages((prev) => {
      const greeting: ChatMessage[] =
        prev.length === 0
          ? [{ id: newId(), role: "bot", text: GREETING, at: now }]
          : [];
      return [
        ...greeting,
        ...prev,
        { id: newId(), role: "user", text: trimmed, at: now },
      ];
    });
    setLoading(true);

    const conversationHistory = messages.slice(-6).map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          session_id: sessionId,
          history: conversationHistory,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();

      if (data.session_id) setSessionId(data.session_id);

      const answer =
        data.reply ||
        data.answer ||
        "I could not find an answer. Please check our Contact page for more information.";

      const sources: ChatSource[] = Array.isArray(data.sources)
        ? data.sources.map((s: { title?: string; url?: string } | string) =>
            typeof s === "string"
              ? { title: s, url: "/about" }
              : { title: s.title || "IHDUA", url: s.url || "/about" },
          )
        : [];

      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "bot",
          text: answer,
          at: Date.now(),
          sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "bot",
          text: "I could not reach the server right now. Please try again in a moment or visit our Contact page.",
          at: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onMessageLinkClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const section = target.closest("[data-scroll-to]");
    const scrollTo = section?.getAttribute("data-scroll-to");

    if (scrollTo === "donate") {
      setOpen(false);
      if (isHomePath(pathname)) {
        void scrollToDonateSection();
      } else {
        sessionStorage.setItem("scroll_to_donate", "true");
        router.push("/");
      }
      return;
    }

    const href = target.closest("a")?.getAttribute("href") ?? "";
    if (href.startsWith("/") && window.matchMedia("(max-width: 639px)").matches) {
      setOpen(false);
    }
  }

  function resetChat() {
    setMessages([]);
    setSessionId(undefined);
    setInput("");
    inputRef.current?.focus();
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendQuestion(input);
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void sendQuestion(input);
    }
  }

  function toggle() {
    dismissTeaser();
    restoreChat();
    setOpen((prev) => !prev);
  }

  const isEmpty = messages.length === 0;

  return (
    <div data-chatbot className="contents">
      {/* ──────────────────────── Chat Panel ──────────────────────── */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="chat-panel"
            role="dialog"
            aria-modal="false"
            aria-label="IHDUA AI Assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-x-3 bottom-3 top-auto z-50 flex h-[min(600px,calc(100dvh-2rem))] flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:inset-auto sm:right-6 sm:bottom-[90px] sm:h-[min(600px,calc(100dvh-7rem))] sm:w-[380px]"
          >
            {/* ────── Gradient Header ────── */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#B250B5] via-[#DE9FD7] to-[#FCE7D5] px-5 py-3.5 select-none">
              {/* Left: Avatar + Title + Online */}
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 rounded-full overflow-hidden shadow-xs ring-2 ring-white/50">
                  <Image
                    src="/chatbot/chatbot-icon.png"
                    alt="Ai Assistant"
                    width={40}
                    height={40}
                    priority
                    className="size-full object-cover"
                  />
                </div>
                <div className="flex flex-col leading-tight">
                  <p className="font-figtree text-[15px] font-bold text-[#1A1A1A]">
                    Ai Assistant
                  </p>
                  <p className="flex items-center gap-1.5 font-figtree text-xs font-medium text-[#1A1A1A]">
                    <span className="size-2 rounded-full bg-[#34A853] shadow-xs" />
                    Online
                  </p>
                </div>
              </div>

              {/* Right: Reset + IHDUA Logo + Close */}
              <div className="flex items-center gap-3">
                {!isEmpty && (
                  <button
                    type="button"
                    onClick={resetChat}
                    title="New conversation"
                    aria-label="Reset chat"
                    className="flex size-7 items-center justify-center rounded-full text-[#1A1A1A]/70 hover:bg-black/10 hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="relative size-6 shrink-0 rounded-full overflow-hidden">
                    <Image
                      src="/ihdua-round.png"
                      alt="IHDUA"
                      width={24}
                      height={24}
                      className="size-full object-contain"
                    />
                  </div>
                  <span className="font-figtree text-xs font-bold tracking-wider text-[#1A1A1A]">
                    IHDUA
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="flex size-7 items-center justify-center rounded-full text-[#1A1A1A] hover:bg-black/10 transition-colors cursor-pointer ml-0.5"
                >
                  <X className="size-5" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* ────── Messages / Body ────── */}
            <div
              ref={listRef}
              onClick={onMessageLinkClick}
              className={`flex-1 overflow-y-auto px-5 [scrollbar-width:thin] ${
                isEmpty ? "flex flex-col justify-center py-6" : "space-y-3.5 py-4"
              }`}
            >
              {isEmpty ? (
                /* ─── Empty State matching design mockup ─── */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Centered Large Chatbot Icon */}
                  <div className="relative flex size-20 items-center justify-center rounded-full p-1.5 bg-[#F5EAF5] shadow-xs mb-3">
                    <div className="size-16 rounded-full overflow-hidden">
                      <Image
                        src="/chatbot/chatbot-icon.png"
                        alt="Ai Assistant"
                        width={64}
                        height={64}
                        priority
                        className="size-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Serif Italic Greeting Heading */}
                  <h3 className="font-lora italic text-[22px] font-medium text-[#1A1A1A] leading-snug mb-6">
                    Namaste! How can we help you? 👋
                  </h3>

                  {/* 4 Quick Suggestion Pills */}
                  <div className="w-full space-y-2.5">
                    {WELCOME_SUGGESTIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => void sendQuestion(item.label)}
                        className="group flex w-full items-center justify-between rounded-full bg-[#FAF5FA] hover:bg-[#F3EBF3] px-5 py-3.5 transition-all text-left cursor-pointer border border-transparent hover:border-[#9739A8]/20 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-base shrink-0 select-none">
                            {item.icon}
                          </span>
                          <span className="font-figtree text-sm font-medium text-[#1A1A1A] truncate">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight className="size-4 shrink-0 text-[#1A1A1A] transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ─── Active Conversation Stream ─── */
                messages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2.5 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser && (
                        <div className="relative size-7 shrink-0 rounded-full overflow-hidden mt-0.5">
                          <Image
                            src="/chatbot/chatbot-icon.png"
                            alt="Ai Assistant"
                            width={28}
                            height={28}
                            className="size-full object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`flex max-w-[84%] flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`font-figtree text-sm leading-relaxed ${
                            isUser
                              ? "rounded-2xl rounded-br-xs bg-[#9739A8] text-white px-4 py-2.5 shadow-xs"
                              : "rounded-2xl rounded-tl-xs border border-[#E5DDF3] bg-white text-[#1A1A1A] p-3.5 shadow-xs"
                          }`}
                        >
                          <FormattedText text={msg.text} />

                          {/* Subtle source chips */}
                          {!isUser && msg.sources && msg.sources.length > 0 ? (
                            <div className="mt-2.5 pt-2 border-t border-[#E5DDF3]/60 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-[#8A9596] font-medium">
                                Sources:
                              </span>
                              {msg.sources.map((s, idx) => {
                                const isDonate =
                                  s.url === "#donate" ||
                                  s.url === "/#donate" ||
                                  s.url === "#cta-donate" ||
                                  s.url === "/#cta-donate" ||
                                  s.title?.toLowerCase().includes("donate");

                                if (isDonate) {
                                  return (
                                    <button
                                      key={idx}
                                      type="button"
                                      onClick={() => {
                                        setOpen(false);
                                        if (isHomePath(pathname)) {
                                          void scrollToDonateSection();
                                        } else {
                                          sessionStorage.setItem("scroll_to_donate", "true");
                                          router.push("/#cta-donate");
                                        }
                                      }}
                                      className="inline-flex items-center gap-1 rounded-md bg-[#FAF7FB] px-1.5 py-0.5 text-[10px] font-medium text-[#9739A8] hover:bg-[#9739A8] hover:text-white transition cursor-pointer"
                                    >
                                      {s.title}
                                      <ExternalLink className="size-2.5" />
                                    </button>
                                  );
                                }

                                return (
                                  <Link
                                    key={idx}
                                    href={s.url || "/about"}
                                    className="inline-flex items-center gap-1 rounded-md bg-[#FAF7FB] px-1.5 py-0.5 text-[10px] font-medium text-[#9739A8] hover:bg-[#9739A8] hover:text-white transition"
                                  >
                                    {s.title}
                                    <ExternalLink className="size-2.5" />
                                  </Link>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>

                        <span className="mt-1 px-1 text-[10px] text-[#8A9596]">
                          {formatTime(msg.at)}
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}

              {loading ? <TypingIndicator /> : null}
            </div>

            {/* ────── Input Composer ────── */}
            <div className="shrink-0 bg-white p-4 pt-2">
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white py-1.5 pl-5 pr-1.5 transition-all focus-within:border-[#9739A8] focus-within:ring-2 focus-within:ring-[#9739A8]/15 shadow-2xs"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder="Type your message..."
                  className="min-w-0 flex-1 bg-transparent py-1.5 font-figtree text-sm text-[#1A1A1A] outline-none placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F6C343] hover:bg-[#EBB533] text-[#1A1A1A] shadow-xs transition-all disabled:opacity-40 disabled:hover:bg-[#F6C343] cursor-pointer"
                >
                  <Send className="size-4.5 -rotate-12 translate-x-0.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ──────────────────────── Floating Launcher ──────────────────────── */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-6 sm:right-6">
        {/* Subtle Teaser */}
        <AnimatePresence>
          {showTeaser && !open ? (
            <motion.div
              key="teaser"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              className="relative hidden items-center gap-2 rounded-full border border-[#E5DDF3] bg-white py-1.5 pl-3.5 pr-2.5 shadow-lg sm:flex"
            >
              <button
                type="button"
                onClick={toggle}
                className="text-xs font-figtree font-medium text-[#00191B] hover:text-[#9739A8] cursor-pointer"
              >
                How can <span className="font-bold text-[#9739A8]">IHDUA</span> help? 👋
              </button>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="Dismiss teaser"
                className="text-[#8A9596] hover:text-[#00191B] cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Floating Launcher Button */}
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={open ? "Close chat" : "Open IHDUA AI Assistant"}
          className="relative flex size-14 sm:size-16 items-center justify-center rounded-full shadow-2xl transition focus:outline-none cursor-pointer"
        >
          {open ? (
            <div className="flex size-full items-center justify-center rounded-full bg-[#9739A8] text-white shadow-lg">
              <X className="size-6 text-white" strokeWidth={2.5} />
            </div>
          ) : (
            <div className="relative size-full rounded-full overflow-hidden shadow-lg shadow-purple-950/20">
              <Image
                src="/chatbot/chatbot-icon.png"
                alt="IHDUA AI Assistant"
                width={64}
                height={64}
                priority
                className="size-full object-cover"
              />
            </div>
          )}
        </motion.button>
      </div>
    </div>
  );
}

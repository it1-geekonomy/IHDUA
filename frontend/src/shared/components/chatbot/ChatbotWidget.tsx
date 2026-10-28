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
  GraduationCap,
  Heart,
  MapPin,
  MessageSquare,
  RotateCcw,
  Send,
  Users,
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
const GREETING = "Hello, and welcome to IHDUA.\nHow can I help you today?";
const MAX_MESSAGE_LENGTH = 1000;

const SUGGESTIONS = [
  {
    label: "What education programs do you run?",
    icon: GraduationCap,
    iconClass: "text-[#9739A8]",
  },
  {
    label: "How does IHDUA empower women?",
    icon: Users,
    iconClass: "text-[#E8893A]",
  },
  {
    label: "How can I donate with 80G tax benefit?",
    icon: Heart,
    iconClass: "fill-[#E5383B] text-[#E5383B]",
  },
  {
    label: "Where is the IHDUA office located?",
    icon: MapPin,
    iconClass: "text-[#2E9E4F]",
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

  if (href === "#donate" || href === "/#donate") {
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
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#9739A8]/10">
        <Image
          src="/IHDUAFavicon.png"
          alt="IHDUA"
          width={18}
          height={18}
          className="size-4.5 object-contain"
        />
      </div>
      <div className="flex items-end gap-1.5 pt-2" aria-label="IHDUA is typing">
        {[5, 7, 5].map((dot, i) => (
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
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

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setInput("");
    requestAnimationFrame(resizeInput);
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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, session_id: sessionId }),
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

  function onInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
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
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#FAF7FB] sm:inset-auto sm:right-6 sm:bottom-[130px] sm:h-[min(560px,calc(100dvh-10rem))] sm:w-[370px] sm:rounded-2xl sm:border sm:border-[#E5DDF3] sm:shadow-2xl"
          >
            {/* ────── Minimal Header ────── */}
            <div className="flex shrink-0 items-center justify-between border-b border-[#E5DDF3] bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-8.5 items-center justify-center rounded-full bg-[#9739A8]/10">
                  <Image
                    src="/IHDUAFavicon.png"
                    alt="IHDUA"
                    width={22}
                    height={22}
                    className="size-5 object-contain"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="leading-tight">
                  <p className="font-figtree text-sm font-bold text-[#00191B]">
                    Ask IHDUA
                  </p>
                  <p className="flex items-center gap-1 font-figtree text-xs text-[#5F6C6D]">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {!isEmpty ? (
                  <button
                    type="button"
                    onClick={resetChat}
                    title="New conversation"
                    aria-label="Reset chat"
                    className="flex size-8 items-center justify-center rounded-full text-[#5F6C6D] transition hover:bg-[#FAF7FB] hover:text-[#00191B]"
                  >
                    <RotateCcw className="size-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title="Close chat"
                  aria-label="Close chat"
                  className="flex size-8 items-center justify-center rounded-full text-[#5F6C6D] transition hover:bg-[#FAF7FB] hover:text-[#00191B]"
                >
                  <X className="size-4.5" strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* ────── Messages / Body ────── */}
            <div
              ref={listRef}
              onClick={onMessageLinkClick}
              className={`flex-1 space-y-3.5 overflow-y-auto px-4 [scrollbar-width:thin] ${
                isEmpty ? "flex flex-col justify-center py-4" : "py-4"
              }`}
            >
              {isEmpty ? (
                /* ─── Empty State: Minimalist & Clean ─── */
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#9739A8]/10 mb-3">
                    <Image
                      src="/IHDUAFavicon.png"
                      alt="IHDUA"
                      width={36}
                      height={36}
                      className="size-8 object-contain"
                    />
                  </div>

                  <h3 className="font-figtree text-base font-bold text-[#00191B]">
                    Hey! How can we help you? 👋
                  </h3>
                  <p className="mt-1 text-xs text-[#5F6C6D] max-w-[240px]">
                    Ask anything about our rural programs, schools, donations, and impact.
                  </p>

                  <div className="mt-4 flex w-full flex-col gap-2">
                    {SUGGESTIONS.map(({ label, icon: Icon, iconClass }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => void sendQuestion(label)}
                        className="group flex w-full items-center gap-2.5 rounded-xl border border-[#E5DDF3] bg-white px-3.5 py-2.5 text-left transition hover:border-[#9739A8] hover:bg-[#FAF7FB]"
                      >
                        <Icon className={`size-4 shrink-0 ${iconClass}`} />
                        <span className="flex-1 font-figtree text-xs font-medium text-[#00191B]">
                          {label}
                        </span>
                        <ChevronRight className="size-3.5 text-[#8A9596] transition group-hover:translate-x-0.5 group-hover:text-[#9739A8]" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                /* ─── Conversation Stream ─── */
                messages.map((msg) => {
                  const isUser = msg.role === "user";

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-start gap-2 ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isUser ? (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#9739A8]/10 mt-1">
                          <Image
                            src="/IHDUAFavicon.png"
                            alt="IHDUA"
                            width={18}
                            height={18}
                            className="size-4 object-contain"
                          />
                        </div>
                      ) : null}

                      <div
                        className={`flex max-w-[84%] flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`font-figtree text-sm leading-relaxed ${
                            isUser
                              ? "rounded-2xl rounded-br-sm bg-[#9739A8] text-white px-3.5 py-2.5"
                              : "rounded-2xl rounded-tl-sm border border-[#E5DDF3] bg-white text-[#00191B] p-3.5 shadow-sm"
                          }`}
                        >
                          <FormattedText text={msg.text} />

                          {/* Subtle source chips */}
                          {!isUser && msg.sources && msg.sources.length > 0 ? (
                            <div className="mt-2.5 pt-2 border-t border-[#E5DDF3]/60 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-[#8A9596] font-medium">
                                Sources:
                              </span>
                              {msg.sources.map((s, idx) => (
                                <Link
                                  key={idx}
                                  href={s.url || "/about"}
                                  className="inline-flex items-center gap-1 rounded-md bg-[#FAF7FB] px-1.5 py-0.5 text-[10px] font-medium text-[#9739A8] hover:bg-[#9739A8] hover:text-white transition"
                                >
                                  {s.title}
                                  <ExternalLink className="size-2.5" />
                                </Link>
                              ))}
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

            {/* ────── Minimal Input Composer ────── */}
            <div className="shrink-0 border-t border-[#E5DDF3] bg-white p-3">
              <form
                onSubmit={onSubmit}
                className="flex items-center gap-2 rounded-full border border-[#E5DDF3] bg-[#FAF7FB] py-1 pl-4 pr-1.5 transition focus-within:border-[#9739A8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#9739A8]/20"
              >
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    resizeInput();
                  }}
                  onKeyDown={onInputKeyDown}
                  maxLength={MAX_MESSAGE_LENGTH}
                  placeholder="Type your message..."
                  className="max-h-[100px] min-w-0 flex-1 resize-none bg-transparent py-1.5 font-figtree text-sm text-[#00191B] outline-none placeholder:text-[#8A9596]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#9739A8] text-white transition hover:bg-[#832B92] disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ──────────────────────── Clean Floating Launcher ──────────────────────── */}
      <div className="fixed bottom-14 right-4 z-50 flex flex-col items-end gap-2.5 sm:bottom-16 sm:right-6">
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
                className="text-xs font-figtree font-medium text-[#00191B] hover:text-[#9739A8]"
              >
                How can <span className="font-bold text-[#9739A8]">IHDUA</span> help?
              </button>
              <button
                type="button"
                onClick={dismissTeaser}
                aria-label="Dismiss teaser"
                className="text-[#8A9596] hover:text-[#00191B]"
              >
                <X className="size-3" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Clean Launcher Icon */}
        <motion.button
          type="button"
          onClick={toggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={open ? "Close chat" : "Open IHDUA AI Assistant"}
          className="relative flex size-14 items-center justify-center rounded-full bg-[#9739A8] text-white shadow-xl shadow-[#9739A8]/30 transition focus:outline-none"
        >
          {!open ? (
            <motion.span
              aria-hidden
              className="absolute inset-1 rounded-full border border-[#FFD638]"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            />
          ) : null}

          {open ? (
            <X className="size-6 text-white" strokeWidth={2} />
          ) : (
            <MessageSquare className="size-6 text-white" />
          )}
        </motion.button>
      </div>
    </div>
  );
}

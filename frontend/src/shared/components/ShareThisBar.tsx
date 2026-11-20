"use client";

import { useCallback, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FOOTER_SOCIAL_LINKS } from "@/shared/constants/footer";

type Props = {
  /** Absolute or path URL to share. Defaults to current page. */
  url?: string;
  title?: string;
  label?: string;
  className?: string;
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function resolveShareUrl(url?: string) {
  if (typeof window === "undefined") return url || "";
  if (!url) return window.location.href;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${window.location.origin}${url.startsWith("/") ? url : `/${url}`}`;
}

const INSTAGRAM_HREF =
  FOOTER_SOCIAL_LINKS.find((s) => s.name === "Instagram")?.href ||
  "https://www.instagram.com/";

export default function ShareThisBar({
  url,
  title = "",
  label = "Share this story",
  className = "",
}: Props) {
  const [copied, setCopied] = useState(false);

  const getUrl = useCallback(() => resolveShareUrl(url), [url]);

  const copyLink = useCallback(async () => {
    const shareUrl = getUrl();
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [getUrl]);

  const shareFacebook = () => {
    const shareUrl = encodeURIComponent(getUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  const shareWhatsApp = () => {
    const shareUrl = getUrl();
    const text = encodeURIComponent(
      title ? `${title}\n${shareUrl}` : shareUrl,
    );
    window.open(
      `https://wa.me/?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const shareInstagram = async () => {
    // Instagram has no web share URL — copy link, then open IHDUA Instagram.
    await copyLink();
    window.open(INSTAGRAM_HREF, "_blank", "noopener,noreferrer");
  };

  const iconBtn =
    "inline-flex size-9 items-center justify-center rounded-full text-[#2D2926] transition-colors hover:bg-black/5 hover:text-[#00191B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B58D43]";

  return (
    <div
      className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}
      role="group"
      aria-label={label}
    >
      <p className="font-lora text-base font-normal text-[#B58D43] sm:text-lg">
        {label}
      </p>

      <div className="flex items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={shareFacebook}
          className={iconBtn}
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <FacebookIcon className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => void shareInstagram()}
          className={iconBtn}
          aria-label="Copy link and open Instagram"
          title="Copy link for Instagram"
        >
          <InstagramIcon className="size-5" />
        </button>

        <button
          type="button"
          onClick={shareWhatsApp}
          className={iconBtn}
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
          <WhatsAppIcon className="size-5" />
        </button>

        <button
          type="button"
          onClick={() => void copyLink()}
          className={iconBtn}
          aria-label={copied ? "Link copied" : "Copy link"}
          title={copied ? "Copied!" : "Copy link"}
        >
          {copied ? (
            <Check className="size-5 text-emerald-600" strokeWidth={2} />
          ) : (
            <Link2 className="size-5" strokeWidth={1.75} />
          )}
        </button>
      </div>
    </div>
  );
}

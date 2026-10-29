import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, FileCheck, ShieldAlert, Sparkles } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:6061/api";

type PublishedTermsResponse = {
  statusCode: number;
  data: {
    id: string;
    title: string;
    content: string;
    status: string;
    metaTitle: string | null;
    metaDescription: string | null;
    schemaCode: string | null;
    createdAt: string;
    updatedAt: string;
  };
};

async function getPublishedTerms(): Promise<PublishedTermsResponse["data"] | null> {
  try {
    const res = await fetch(`${API_BASE}/terms-and-conditions/published`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const terms = await getPublishedTerms();

  return {
    title: terms?.metaTitle || terms?.title || "Terms and Conditions | IHDUA",
    description:
      terms?.metaDescription ||
      "Official terms of service, governance policies, and platform regulations for IHDUA.",
  };
}

export default async function TermsAndConditionsPublicPage() {
  const terms = await getPublishedTerms();

  return (
    <main className="min-h-screen bg-[#FDFCF9] text-[#140816]">
      {/* Schema Structured Data Injection if present */}
      {terms?.schemaCode && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: terms.schemaCode }}
        />
      )}

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B5D51] to-[#08483F] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Breadcrumbs */}
          <nav className="inline-flex items-center gap-1.5 text-xs text-emerald-200/80 mb-6 font-figtree">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white font-medium">Terms and Conditions</span>
          </nav>

          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            {terms?.title || "Terms and Conditions"}
          </h1>

          <p className="mt-4 font-figtree text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before engaging with our services, making donations, or utilizing our community platform.
          </p>

          {terms?.updatedAt && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-xs px-3.5 py-1 text-xs text-emerald-100 font-figtree">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Last Updated:{" "}
                {new Date(terms.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Main Legal Content Container */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-10 lg:p-14 shadow-sm">
          {terms ? (
            <article
              className="terms-content font-figtree text-[#27272A] leading-relaxed
                [&>h1]:font-outfit [&>h1]:text-2xl [&>h1]:sm:text-3xl [&>h1]:font-bold [&>h1]:text-[#0B5D51] [&>h1]:mt-8 [&>h1]:mb-4
                [&>h2]:font-outfit [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:text-[#0B5D51] [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-stone-200
                [&>h3]:font-outfit [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:text-stone-900 [&>h3]:mt-6 [&>h3]:mb-2
                [&>p]:text-sm [&>p]:sm:text-base [&>p]:mb-4 [&>p]:leading-relaxed
                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-1.5 [&>ul]:text-sm [&>ul]:sm:text-base
                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-1.5 [&>ol]:text-sm [&>ol]:sm:text-base
                [&>blockquote]:border-l-4 [&>blockquote]:border-[#0B5D51] [&>blockquote]:bg-stone-50 [&>blockquote]:p-4 [&>blockquote]:italic [&>blockquote]:rounded-r-xl [&>blockquote]:my-4
                [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table]:text-sm
                [&_th]:bg-stone-100 [&_th]:border [&_th]:border-stone-300 [&_th]:p-3 [&_th]:text-left [&_th]:font-semibold
                [&_td]:border [&_td]:border-stone-200 [&_td]:p-3
                [&_a]:text-[#0B5D51] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#08483F]"
              dangerouslySetInnerHTML={{ __html: terms.content }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 mb-4 border border-amber-200/80">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <h2 className="font-outfit text-xl font-bold text-stone-900">
                Terms and Conditions Coming Soon
              </h2>
              <p className="mt-2 font-figtree text-sm text-stone-500 max-w-md">
                Our team is currently finalizing our updated legal policies. Please check back shortly or reach out to our team directly.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0B5D51] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#08483F] transition-all"
              >
                <span>Contact IHDUA Support</span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer legal disclaimer card */}
        <div className="mt-8 rounded-2xl border border-stone-200/80 bg-stone-50/70 p-6 text-xs text-stone-500 font-figtree leading-relaxed flex items-start gap-3">
          <FileCheck className="h-5 w-5 text-[#0B5D51] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-stone-700">Governance & Compliance Notice</p>
            <p className="mt-0.5">
              These terms are reviewed periodically by the Integrated Holistic Development of Urban and Rural Areas (IHDUA) governing body to ensure adherence to statutory norms and non-profit ethical standards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

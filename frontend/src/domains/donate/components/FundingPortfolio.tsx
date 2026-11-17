"use client";

import { useState } from "react";
import type { FundingProject } from "@/domains/donate/constants/fundingProjects";
import { openDonationCheckout } from "@/domains/home/lib/donation";
import HeroBanner from "@/shared/components/Herobanner";

const DONATE_BANNER = {
  heading: "Together, We Can Create Lasting Change.",
  description:
    "Your support can create opportunities in education, strengthen livelihoods and empower rural communities. Explore meaningful initiatives and discover where your contribution can make a difference.",
  image:
    "https://pub-a6675db0619c4dcfa4dbe2528e4f1daa.r2.dev/website/impact/1794904521851-mdaub-frame-648.webp",
  imageAlt: "IHDUA community creating lasting change",
};

/** Dynamic donation category: project only, or project — component */
function donationCause(projectTitle: string, componentName?: string) {
  const project = projectTitle.trim();
  const component = componentName?.trim();
  if (!component) return project;
  return `${project} — ${component}`;
}

function scrollToProject(id: string) {
  const el = document.getElementById(`project-${id}`);
  if (!el) return;
  const offset = window.innerWidth >= 1024 ? 96 : 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

function DonateButton({
  label,
  amountDigits,
  cause,
  variant = "primary",
}: {
  label: string;
  amountDigits?: string;
  cause: string;
  variant?: "primary" | "ghost";
}) {
  return (
    <button
      type="button"
      onClick={() => openDonationCheckout(amountDigits || "5000", "IN", 0, cause)}
      className={
        variant === "primary"
          ? "inline-flex items-center justify-center bg-[#FFD638] px-4 py-2.5 font-figtree text-sm font-bold text-[#00191B] transition hover:opacity-90"
          : "inline-flex items-center justify-center border border-[#9739A8]/40 px-3 py-1.5 font-figtree text-xs font-semibold text-[#9739A8] transition hover:bg-[#9739A8]/5"
      }
    >
      {label}
    </button>
  );
}

function ProjectCard({ project }: { project: FundingProject }) {
  return (
    <article className="flex h-full flex-col border border-[#E8E2EC] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="font-figtree text-xs font-semibold tracking-[0.18em] text-[#9739A8]">
          PROJECT {project.number}
        </span>
        <span className="shrink-0 font-figtree text-sm font-bold text-[#00191B]">
          {project.totalLabel}
        </span>
      </div>
      <h3 className="mt-3 font-lora text-xl leading-snug text-[#00191B] sm:text-2xl">
        {project.title}
      </h3>
      <p className="mt-3 flex-1 font-figtree text-sm leading-relaxed text-[#3F4A4B]">
        {project.summary}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => scrollToProject(project.id)}
          className="inline-flex items-center justify-center border border-[#00191B]/15 px-4 py-2.5 font-figtree text-sm font-semibold text-[#00191B] transition hover:border-[#00191B]/40"
        >
          View breakup
        </button>
        <DonateButton
          label="Donate"
          cause={donationCause(project.title || project.cause)}
          amountDigits="5000"
        />
      </div>
    </article>
  );
}

function ProjectDetail({ project, open, onToggle }: {
  project: FundingProject;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <section
      id={`project-${project.id}`}
      className="scroll-mt-24 border border-[#E8E2EC] bg-white"
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left sm:px-7 sm:py-6"
        aria-expanded={open}
      >
        <div>
          <p className="font-figtree text-xs font-semibold tracking-[0.18em] text-[#9739A8]">
            PROJECT {project.number}
          </p>
          <h2 className="mt-2 font-lora text-2xl text-[#00191B] sm:text-3xl">
            {project.title}
          </h2>
          <p className="mt-2 max-w-3xl font-figtree text-sm leading-relaxed text-[#3F4A4B] sm:text-base">
            {project.summary}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-figtree text-lg font-bold text-[#00191B] sm:text-xl">
            {project.totalLabel}
          </p>
          <p className="mt-1 font-figtree text-xs text-[#9739A8]">
            {open ? "Hide breakup" : "Show breakup"}
          </p>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E8E2EC] px-5 pb-6 pt-5 sm:px-7 sm:pb-8">
          {project.highlights && project.highlights.length > 0 && (
            <ul className="mb-6 grid gap-2 sm:grid-cols-2">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-figtree text-sm text-[#3F4A4B]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9739A8]" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          <h3 className="font-figtree text-sm font-bold uppercase tracking-wide text-[#00191B]">
            Funding breakup
          </h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#E8E2EC]">
                  <th className="py-2 pr-4 font-figtree text-xs font-semibold uppercase tracking-wide text-[#6B7576]">
                    Component
                  </th>
                  <th className="py-2 pr-4 font-figtree text-xs font-semibold uppercase tracking-wide text-[#6B7576]">
                    Amount sought
                  </th>
                  <th className="py-2 font-figtree text-xs font-semibold uppercase tracking-wide text-[#6B7576]">
                    Support
                  </th>
                </tr>
              </thead>
              <tbody>
                {project.components.map((row) => (
                  <tr key={row.name} className="border-b border-[#F0EBF3]">
                    <td className="py-3 pr-4 font-figtree text-sm text-[#00191B]">
                      {row.name}
                    </td>
                    <td className="py-3 pr-4 font-figtree text-sm font-semibold text-[#00191B]">
                      {row.amountLabel}
                    </td>
                    <td className="py-3">
                      {row.amountDigits ? (
                        <DonateButton
                          label="Donate"
                          cause={donationCause(project.title || project.cause, row.name)}
                          amountDigits={row.amountDigits}
                          variant="ghost"
                        />
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="pt-4 font-figtree text-sm font-bold text-[#00191B]">
                    Total project budget
                  </td>
                  <td className="pt-4 font-figtree text-sm font-bold text-[#9739A8]">
                    {project.totalLabel}
                  </td>
                  <td className="pt-4">
                    <DonateButton
                      label="Support project"
                      cause={donationCause(project.title || project.cause)}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export function FundingPortfolio({ projects }: { projects: FundingProject[] }) {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const countLabel =
    projects.length === 1 ? "1 project" : `${projects.length} projects`;

  return (
    <div className="w-full">
      <HeroBanner
        heading={DONATE_BANNER.heading}
        description={DONATE_BANNER.description}
        image={DONATE_BANNER.image}
        imageMobile={DONATE_BANNER.image}
        imageAlt={DONATE_BANNER.imageAlt}
      />

      <section
        id="funding-projects"
        className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 sm:py-16 lg:px-10 2xl:px-40"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-lora text-3xl text-[#00191B] sm:text-4xl">
              Projects seeking support
            </h2>
            <p className="mt-2 max-w-xl font-figtree text-sm text-[#3F4A4B] sm:text-base">
              Totals from IHDUA&apos;s funding proposals. Open any project for
              the full component-wise breakup.
            </p>
          </div>
          <p className="font-figtree text-sm font-semibold text-[#9739A8]">
            {countLabel}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="border-t border-[#E8E2EC] bg-[#FAF8FB]">
        <div className="mx-auto max-w-[1600px] space-y-4 px-6 py-12 sm:px-10 sm:py-16 lg:px-10 2xl:px-40">
          <h2 className="font-lora text-3xl text-[#00191B] sm:text-4xl">
            Donation breakup by project
          </h2>
          <p className="max-w-2xl font-figtree text-sm text-[#3F4A4B] sm:text-base">
            Component amounts are the funding sought. Use Donate on a line item
            to pre-fill that amount in the donation form below.
          </p>
          <div className="mt-6 space-y-4">
            {projects.map((project) => (
              <ProjectDetail
                key={project.id}
                project={project}
                open={openId === project.id}
                onToggle={() =>
                  setOpenId((prev) => (prev === project.id ? null : project.id))
                }
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

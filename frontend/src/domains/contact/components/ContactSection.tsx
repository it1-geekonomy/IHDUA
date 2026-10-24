"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Search, Send } from "lucide-react";
import Typography from "@/lib/Typography";
import { DONATION_COUNTRIES, type DonationCountry } from "@/domains/home/constants/donationCountries";
import { CountryFlag } from "@/domains/home/components/donation/CountryFlag";
import { CONTACT_ITEMS, FIELD_CLASS, SUBJECTS } from "../const/contactsection";

// Closes a dropdown when the user clicks outside the returned ref's element
function useClickOutside<T extends HTMLElement>(setOpen: (open: boolean) => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setOpen]);
  return ref;
}

function Field({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block cursor-pointer">
        <Typography as="span" variant="body-sm" className="font-figtree font-medium text-[#00191B]">
          {label}
        </Typography>
      </label>
      {children}
    </div>
  );
}

function PhoneField() {
  const [country, setCountry] = useState<DonationCountry>(
    () => DONATION_COUNTRIES.find((c) => c.code === "IN") || DONATION_COUNTRIES[0]
  );
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useClickOutside<HTMLDivElement>(setOpen);

  const query = search.toLowerCase();
  const countries = DONATION_COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(query) || c.dial.includes(search)
  );

  return (
    <Field id="mobile" label="Mobile Number*">
      <div
        ref={ref}
        className="relative flex items-center border border-[#E5DDF3] bg-[#FDFBFD] px-4 py-3 font-figtree text-sm text-[#00191B] focus-within:border-[#9739A8]"
      >
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 focus:outline-none"
          aria-label="Select country code"
        >
          <CountryFlag countryCode={country.code} className="h-3.5 w-5 rounded-[1px] object-cover" />
          <ChevronDown
            className={`size-3.5 text-[#5F6C6D] transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        <input
          id="mobile"
          name="mobile"
          type="tel"
          required
          placeholder={`${country.dial} 1234567890`}
          className="min-w-0 flex-1 bg-transparent pl-3 text-sm text-[#00191B] placeholder:text-[#8A9596] focus:outline-none"
        />
        <input type="hidden" name="countryCode" value={country.code} />
        <input type="hidden" name="dialCode" value={country.dial} />

        {open && (
          <div className="absolute left-0 top-full z-30 mt-1 max-h-60 w-72 overflow-hidden rounded-sm border border-[#D9D3C9] bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-[#EAE6DF] bg-[#FAF8F4] p-2">
              <Search className="size-3.5 text-[#8A847A]" />
              <input
                type="text"
                className="w-full bg-transparent p-1 font-figtree text-xs text-[#00191B] outline-none placeholder:text-[#8A847A]"
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {countries.length === 0 && (
                <div className="p-3 text-center font-figtree text-xs text-[#8A847A]">
                  No countries found.
                </div>
              )}
              {countries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCountry(c);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left font-figtree text-xs transition-colors hover:bg-[#FAF8F4] ${
                    country.code === c.code ? "bg-[#FAF8F4] font-semibold text-[#9739A8]" : "text-[#00191B]"
                  }`}
                >
                  <CountryFlag countryCode={c.code} className="h-3 w-4.5 shrink-0 rounded-[1px] object-cover" />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="shrink-0 text-[#8A847A]">{c.dial}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}

function SubjectField() {
  const [subject, setSubject] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(setOpen);

  return (
    <Field id="subject" label="Subject*">
      <div ref={ref} className="relative">
        <button
          id="subject"
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`${FIELD_CLASS} flex cursor-pointer items-center justify-between pr-10 text-left ${
            subject ? "text-[#00191B]" : "text-[#8A9596]"
          }`}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="truncate">{subject || "Select a subject"}</span>
        </button>
        <ChevronDown
          className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#5F6C6D] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
        <input type="hidden" name="subject" required value={subject} />

        {open && (
          <div
            role="listbox"
            className="absolute left-0 top-full z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-sm border border-[#E5DDF3] bg-white py-1 shadow-lg"
          >
            {SUBJECTS.map((s) => (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={subject === s}
                onClick={() => {
                  setSubject(s);
                  setOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center px-4 py-2.5 text-left font-figtree text-sm transition-colors hover:bg-[#FAF8F4] hover:text-[#9739A8] ${
                  subject === s ? "bg-[#FAF8F4] font-semibold text-[#9739A8]" : "text-[#00191B]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </Field>
  );
}

export default function ContactSection() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(Object.fromEntries(new FormData(e.currentTarget))); // replace with your API call
  };

  return (
    <section className="w-full bg-white px-6 py-8 lg:px-10 lg:py-14 2xl:px-40">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-15">
        {/* Left: info */}
        <div className="flex flex-col gap-6 xl:pr-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
            <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
              Contact Us
            </Typography>
            <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
          </div>

          <Typography variant="h3" as="h2" className="w-full font-lora font-normal text-[#00191B]">
            We’d Love to Hear From You
          </Typography>

          <Typography variant="body-lg" className="font-figtree font-normal leading-relaxed text-[#5F6C6D]">
            IHDUA works to support rural communities through education, healthcare, women’s
            empowerment, skill development, and sustainable livelihoods. Contact us to learn more
            about our work or discuss opportunities to connect with our team.
          </Typography>

          <ul className="flex flex-col gap-6">
            {CONTACT_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#EDE3FA]">
                  <Image src={item.iconSrc} alt={item.alt} width={22} height={22} className="size-5.5 object-contain" />
                </span>
                <div className="flex flex-col gap-1">
                  {item.title && (
                    <Typography as="h3" variant="body-lg" className="font-semibold text-[#9739A8]">
                      {item.title}
                    </Typography>
                  )}
                  {item.lines.map((line) => (
                    <div key={line.text} className="flex items-center gap-2">
                      <Typography variant="body-sm" className="font-figtree font-normal text-[#5F6C6D]">
                        {line.text}
                      </Typography>
                      {line.flagSrc && (
                        <Image
                          src={line.flagSrc}
                          alt={line.flagAlt ?? ""}
                          width={20}
                          height={14}
                          className="h-3.5 w-5 object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-[#F5F0FF] p-4 sm:p-6">
          <div>
            <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
              Send us a message
            </Typography>
            <Typography variant="h3" as="h3" className="mt-2 font-lora font-normal text-[#00191B]">
              Get in Touch
            </Typography>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field id="name" label="Full Name*">
              <input id="name" name="name" required placeholder="Your name" className={FIELD_CLASS} />
            </Field>
            <Field id="email" label="Email Address*">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="yourmailaddress@gmail.com"
                className={FIELD_CLASS}
              />
            </Field>
            <PhoneField />
            <SubjectField />
          </div>

          <Field id="message" label="Your Message*" className="flex flex-1 flex-col">
            <textarea
              id="message"
              name="message"
              required
              placeholder="How can we help you?"
              className={`${FIELD_CLASS} min-h-35 flex-1 resize-none`}
            />
          </Field>

          <button
            type="submit"
            className="flex w-full cursor-pointer items-center justify-center gap-2 bg-[#FFD638] py-4 transition-colors hover:bg-[#F5C400]"
          >
            <Typography variant="body-sm" className="font-figtree font-medium text-black">
              Send Message
            </Typography>
            <Send className="size-4 text-black" />
          </button>
        </form>
      </div>
    </section>
  );
}
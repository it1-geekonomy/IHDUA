"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_COPY } from "@/domains/admin/constants";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";

export function AdminLoginForm() {
  const { login, token, ready } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@ihdua.org");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (ready && token) {
      router.replace(searchParams.get("next") || "/admin/donations");
    }
  }, [ready, token, router, searchParams]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      router.replace(searchParams.get("next") || "/admin/donations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#9739A8] px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 20%, #FFD638 0%, transparent 28%), radial-gradient(circle at 85% 75%, #FFFFFF 0%, transparent 32%)",
        }}
      />

      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md overflow-hidden rounded-sm bg-[#F7F4EE] shadow-[0_24px_60px_rgba(26,15,28,0.35)]"
      >
        <div className="flex flex-col items-center bg-[#9739A8] px-8 pb-8 pt-9">
          <Image
            src="/idhualogo1.png"
            alt="IHDUA logo"
            width={180}
            height={180}
            priority
            className="h-16 w-auto object-contain sm:h-20"
          />
          <p className="mt-4 font-manrope text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD638]">
            {ADMIN_COPY.brand}
          </p>
        </div>

        <div className="px-8 pb-8 pt-7">
          <h1 className="text-center font-lora text-3xl text-[#00191B]">
            {ADMIN_COPY.loginTitle}
          </h1>
          <p className="mt-2 text-center font-figtree text-sm leading-relaxed text-[#5F6C6D]">
            {ADMIN_COPY.loginSubtitle}
          </p>

          <label className="mt-8 block font-figtree text-sm font-medium text-[#00191B]">
            {ADMIN_COPY.email}
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-3.5 py-3 outline-none transition-colors placeholder:text-[#8A847A] focus:border-[#9739A8]"
            />
          </label>

          <label className="mt-4 block font-figtree text-sm font-medium text-[#00191B]">
            {ADMIN_COPY.password}
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-[#D9D3C9] bg-[#FAF8F4] px-3.5 py-3 pr-10 outline-none transition-colors placeholder:text-[#8A847A] focus:border-[#9739A8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8A847A] hover:text-[#9739A8] outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error ? (
            <p className="mt-4 font-figtree text-sm text-[#A33B3B]" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-sm bg-[#FFD638] px-4 py-3.5 font-figtree text-[15px] font-bold text-[#00191B] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? ADMIN_COPY.signingIn : ADMIN_COPY.signIn}
          </button>
        </div>
      </form>
    </div>
  );
}

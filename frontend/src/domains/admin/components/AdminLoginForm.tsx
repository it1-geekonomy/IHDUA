"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useAdminAuth } from "@/domains/admin/components/AdminAuthProvider";
import { getSavedEmail, setSavedEmail } from "@/domains/admin/lib/api";

export function AdminLoginForm() {
  const { login, token, ready } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reason = searchParams.get("reason");

  // Populate remembered email
  useEffect(() => {
    const saved = getSavedEmail();
    if (saved) {
      setEmail(saved);
      setRememberMe(true);
    }
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (ready && token) {
      router.replace(searchParams.get("next") || "/admin/donations");
    }
  }, [ready, token, router, searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setSubmitting(true);
    try {
      await login(trimmedEmail, password, rememberMe);
      setSavedEmail(trimmedEmail, rememberMe);
      router.replace(searchParams.get("next") || "/admin/donations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#130716] px-4 py-12 text-white">
      {/* Subtle ambient brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[400px] w-[500px] rounded-full bg-[#9739A8]/20 blur-[130px]"
      />

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Brand Logo & Heading */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Image
              src="/idhualogo1.png"
              alt="IHDUA Logo"
              width={160}
              height={60}
              priority
              className="h-14 w-auto object-contain"
            />
          </Link>
          <h1 className="mt-3 font-lora text-2xl text-white">Sign In</h1>
          <p className="mt-1 font-figtree text-xs text-white/60">
            Authorized management access
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1E0E22]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          {/* Status Alerts */}
          {reason === "session_expired" && !error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-200">
              <Clock className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Session expired. Please sign in again.</span>
            </div>
          )}

          {reason === "logged_out" && !error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>You have signed out successfully.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-figtree text-xs font-medium text-white/80">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/70" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@ihdua.org"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3.5 font-figtree text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#FFD638] focus:bg-white/10"
                />
              </div>
            </div>

            {/* Password with Prominent Eye Toggle */}
            <div>
              <label className="block font-figtree text-xs font-medium text-white/80">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/70" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-12 font-figtree text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#FFD638] focus:bg-white/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-0 top-0 flex h-full items-center px-3.5 text-white transition-colors hover:text-[#FFD638] focus:outline-none cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#FFD638]" strokeWidth={2.2} />
                  ) : (
                    <Eye className="h-5 w-5 text-white" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 accent-[#9739A8]"
                />
                <span className="font-figtree text-xs text-white/70">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFD638] py-3 font-figtree text-sm font-bold text-[#140816] shadow-lg shadow-[#FFD638]/20 transition-all hover:bg-[#FFDE59] active:scale-[0.99] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="font-figtree text-xs text-white/60 transition-colors hover:text-white"
          >
            ← Return to IHDUA Website
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, Card } from "@/components/ui";

function getSafeRedirectPath(redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/dashboard";
  }

  return redirectTo;
}

export function AuthForm({
  mode,
  redirectTo,
}: {
  mode: "login" | "signup";
  redirectTo?: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    tone: "emerald" | "amber" | "rose";
    text: string;
  } | null>(null);

  function getNormalizedEmail() {
    return email.trim().toLowerCase();
  }

  async function continueIntoApp() {
    const destination = getSafeRedirectPath(redirectTo);

    startTransition(() => {
      router.push(destination);
      router.refresh();
    });
  }

  async function tryPasswordSignIn() {
    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      return {
        success: false,
        error: "The account service is not available.",
      };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: getNormalizedEmail(),
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      error: null,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      setMessage({
        tone: "amber",
        text: "Account service isn't available yet. Opening the preconfigured workspace instead.",
      });
      const destination = getSafeRedirectPath(redirectTo);
      startTransition(() => {
        router.push(destination);
      });
      setSubmitting(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: getNormalizedEmail(),
        password,
      });

      if (error) {
        setMessage({
          tone: "rose",
          text:
            error.message === "Invalid login credentials"
              ? "Invalid login credentials. If you just created an account, check your email verification first."
              : error.message,
        });
        setSubmitting(false);
        return;
      }

      await continueIntoApp();
      setSubmitting(false);
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email: getNormalizedEmail(),
      password,
      options: {
        data: {
          full_name: fullName,
          role: "Admin",
        },
      },
    });

    if (error) {
      const loweredMessage = error.message.toLowerCase();
      const canFallbackToLogin =
        loweredMessage.includes("rate limit") ||
        loweredMessage.includes("already registered") ||
        loweredMessage.includes("already exists") ||
        loweredMessage.includes("user already");

      if (canFallbackToLogin) {
        const signInResult = await tryPasswordSignIn();

        if (signInResult.success) {
          setMessage({
            tone: "emerald",
            text: "An account already exists for this email. You were signed in automatically.",
          });
          await continueIntoApp();
          setSubmitting(false);
          return;
        }

        setMessage({
          tone: "amber",
          text:
            "This email may already be registered, but sign-up is temporarily unavailable. Try signing in instead or verify email confirmation settings in your identity provider.",
        });
        setSubmitting(false);
        return;
      }

      setMessage({
        tone: "rose",
        text: error.message,
      });
      setSubmitting(false);
      return;
    }

    if (data.session) {
      setMessage({
        tone: "emerald",
      text: "Account created. You can continue into the workspace.",
      });
      await continueIntoApp();
      setSubmitting(false);
      return;
    }

    setMessage({
      tone: "amber",
      text: "Account created. Please verify your email before signing in.",
    });
    setSubmitting(false);
  }

  return (
    <Card className="border-white/10 bg-white/95 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#265543]">
            {mode === "login" ? "Sign in" : "Create account"}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {mode === "login" ? "Welcome back." : "Create your account."}
          </h1>
        </div>
        <Badge tone="amber">Secure access</Badge>
      </div>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
              placeholder="Aarav Patel"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
            placeholder="ops@northwindmotion.com"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#265543] focus:bg-white"
            placeholder="Enter a secure password"
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              message.tone === "emerald"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : message.tone === "amber"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <button
          className="w-full rounded-2xl bg-[#265543] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1f4537] disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting
            ? "Working..."
            : mode === "login"
              ? "Continue to workspace"
              : "Create account"}
        </button>
      </form>
    </Card>
  );
}

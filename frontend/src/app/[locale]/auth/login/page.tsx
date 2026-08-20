"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { Button, Input } from "@/components";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/state/useAuthStore";
import { api } from "@/lib/axios";
import { getOAuthUrl } from "@/lib/authUrl";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [oauthStarting, setOauthStarting] = useState<"google" | "apple" | null>(
    null,
  );
  const { login } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    if (error === "oauth_failed" || error === "oauthError") {
      setMessage(t("oauthError"));
      return;
    }

    if (error === "OAUTH_ACCOUNT_LINK_REQUIRED") {
      setMessage(t("oauthLinkRequired"));
    }
  }, [searchParams, t]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push(`/${locale}`);
    } catch (err) {
      const error = err as AxiosError<{ code?: string; message?: string }>;
      const code = error.response?.data?.code;
      setNeedsVerification(code === "EMAIL_NOT_VERIFIED");
      setMessage(
        code === "EMAIL_NOT_VERIFIED"
          ? t("emailNotVerified")
          : error.response?.data?.message || t("login") + " failed.",
      );
    }
  };

  const startOAuth = (provider: "google" | "apple") => {
    if (oauthStarting) return;
    setOauthStarting(provider);
    window.location.assign(getOAuthUrl(provider, locale));
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          {t("welcome")}
        </h1>

        <p className="text-sm text-secondary text-center mb-6">
          {t("description")}
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label={t("email")}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />

          <Input
            label={t("password")}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            passwordToggle
            fullWidth
            required
          />

          <div className="flex justify-end">
            <Link
              href={`/${locale}/auth/forgot-password`}
              className="text-xs text-highlight hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth size="md">
            {t("signIn")}
          </Button>
        </form>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <p className="text-sm text-secondary text-center sm:col-span-2">
            {t("orContinueWith")}
          </p>
          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={!!oauthStarting}
            loading={oauthStarting === "google"}
            leftIcon={<FcGoogle className="h-5 w-5" aria-hidden="true" />}
            onClick={() => startOAuth("google")}
          >
            {t("google")}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={!!oauthStarting}
            loading={oauthStarting === "apple"}
            leftIcon={<FaApple className="h-5 w-5" aria-hidden="true" />}
            onClick={() => startOAuth("apple")}
          >
            {t("apple")}
          </Button>
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-accent">{message}</p>
        )}

        {needsVerification && (
          <Button
            type="button"
            variant="outline"
            fullWidth
            className="mt-3"
            onClick={async () => {
              await api.post("/auth/resend-verification", { email });
              setMessage(t("verificationSent"));
            }}
          >
            {t("resendVerification")}
          </Button>
        )}

        <p className="text-sm text-secondary mt-6 text-center">
          {t("noAccount")}{" "}
          <Link
            href={`/${locale}/auth/register`}
            className="text-highlight hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

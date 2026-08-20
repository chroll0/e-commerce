"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { Button, Input } from "@/components";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage(t("passwordMismatch"));
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        phone: phone || undefined,
      });
      setRegistered(true);
      setMessage(t("verificationRequired"));
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setMessage(error.response?.data?.message || t("registerFailed"));
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
        <h1 className="text-2xl font-bold text-primary mb-2 text-center">
          {registered ? t("checkEmail") : t("registration")}
        </h1>

        <p className="text-sm text-secondary text-center mb-6">
          {t("registerPrompt")}
        </p>

        {registered ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-secondary">{message}</p>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={async () => {
                await api.post("/auth/resend-verification", { email });
                setMessage(t("verificationSent"));
              }}
            >
              {t("resendVerification")}
            </Button>
            <Button asChild fullWidth>
              <Link href={`/${locale}/auth/login`}>{t("continueToLogin")}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <Input
              label={t("fullName")}
              type="text"
              placeholder={t("fullNamePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

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
              label={t("phone")}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              autoComplete="tel"
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

            <Input
              label={t("confirmPassword")}
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              passwordToggle
              fullWidth
              required
            />

            <Button type="submit" variant="primary" fullWidth size="md">
              {t("signUp")}
            </Button>
          </form>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-accent">{message}</p>
        )}

        <p className="text-sm text-secondary mt-6 text-center">
          {t("haveAccount")}{" "}
          <Link
            href={`/${locale}/auth/login`}
            className="text-highlight hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button, Input } from "@/components";
import { api } from "@/lib/axios";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">
          {t("forgotPassword")}
        </h1>
        <p className="mt-2 text-sm text-secondary">{t("forgotDescription")}</p>
        {sent ? (
          <p className="mt-6 text-sm text-accent">{t("verificationSent")}</p>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={submit}>
            <Input
              label={t("email")}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />
            <Button type="submit" loading={loading} fullWidth>
              {t("sendReset")}
            </Button>
          </form>
        )}
        {error && <p className="mt-4 text-sm text-accent">{error}</p>}
        <Link
          className="mt-6 block text-center text-sm text-highlight hover:underline"
          href={`/${locale}/auth/login`}
        >
          {t("continueToLogin")}
        </Link>
      </div>
    </div>
  );
}

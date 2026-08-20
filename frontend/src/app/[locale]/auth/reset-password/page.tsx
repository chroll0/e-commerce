"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button, Input } from "@/components";
import { api } from "@/lib/axios";

export default function ResetPasswordPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setMessage(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
        confirmPassword: confirm,
      });
      setSuccess(true);
      setMessage(t("resetSuccess"));
    } catch {
      setMessage(t("resetInvalid"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-primary">
          {t("resetPassword")}
        </h1>
        <p className="mt-2 text-sm text-secondary">{t("resetDescription")}</p>
        {success ? (
          <p className="mt-6 text-sm text-accent">{message}</p>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={submit}>
            <Input
              label={t("password")}
              type="password"
              passwordToggle
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              fullWidth
            />
            <Input
              label={t("confirmPassword")}
              type="password"
              passwordToggle
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              minLength={8}
              required
              fullWidth
            />
            <Button type="submit" loading={loading} fullWidth>
              {t("resetPassword")}
            </Button>
          </form>
        )}
        {message && !success && (
          <p className="mt-4 text-sm text-accent">{message}</p>
        )}
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

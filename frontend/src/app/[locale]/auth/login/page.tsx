"use client";

import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";
import { Button, Input } from "@/components";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const t = useTranslations("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      const error = err as AxiosError<any>;
      setMessage(error.response?.data?.message || t("login") + " failed.");
    }
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
              href="/auth/forgot-password"
              className="text-xs text-highlight hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth size="md">
            {t("signIn")}
          </Button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-accent">{message}</p>
        )}

        <p className="text-sm text-secondary mt-6 text-center">
          {t("noAccount")}{" "}
          <Link
            href="/auth/register"
            className="text-highlight hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

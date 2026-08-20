"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@/components";
import { api } from "@/lib/axios";

export default function VerifyEmailPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const params = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<
    "loading" | "success" | "expired" | "invalid" | "error"
  >(token ? "loading" : "invalid");

  useEffect(() => {
    if (!token) return;
    api
      .get("/auth/verify-email", { params: { token } })
      .then(() => setState("success"))
      .catch((error) =>
        setState(
          error?.response?.data?.code === "VERIFICATION_TOKEN_EXPIRED"
            ? "expired"
            : "invalid",
        ),
      );
  }, [token]);

  return (
    <AuthMessage
      title={
        state === "success"
          ? t("verificationSuccess")
          : state === "expired"
            ? t("verificationExpired")
            : state === "invalid"
              ? t("verificationInvalid")
              : state === "error"
                ? t("verificationError")
                : t("verifyEmail")
      }
      loading={state === "loading"}
    >
      {state === "success" ? (
        <Button asChild>
          <Link href={`/${locale}/auth/login`}>{t("continueToLogin")}</Link>
        </Button>
      ) : state !== "loading" ? (
        <Button asChild>
          <Link href={`/${locale}/auth/login`}>{t("continueToLogin")}</Link>
        </Button>
      ) : null}
    </AuthMessage>
  );
}

function AuthMessage({
  title,
  loading,
  children,
}: {
  title: string;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        {loading && <Spinner size="md" className="mx-auto mt-6" />}
        {children}
      </div>
    </div>
  );
}

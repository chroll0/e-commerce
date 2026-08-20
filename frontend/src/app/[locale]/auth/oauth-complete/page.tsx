"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Spinner } from "@/components";
import { useAuthStore } from "@/state/useAuthStore";

export default function OAuthCompletePage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const params = useSearchParams();
  const status = params.get("status");
  const { completeOAuthLogin } = useAuthStore();
  const [state, setState] = useState<"loading" | "success" | "error">(
    status === "success" ? "loading" : "error",
  );

  useEffect(() => {
    if (status !== "success") return;
    completeOAuthLogin()
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, [completeOAuthLogin, status]);

  if (state === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  if (state === "error")
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-accent">
            {status === "OAUTH_ACCOUNT_LINK_REQUIRED"
              ? t("oauthLinkRequired")
              : t("oauthError")}
          </p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/auth/login`}>{t("continueToLogin")}</Link>
          </Button>
        </div>
      </div>
    );
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm text-primary">{t("signIn")}</p>
        <Button asChild className="mt-4">
          <Link href={`/${locale}/account`}>{t("continueToLogin")}</Link>
        </Button>
      </div>
    </div>
  );
}

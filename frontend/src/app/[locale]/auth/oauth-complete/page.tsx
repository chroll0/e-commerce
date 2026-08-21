"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components";
import { useRouter } from "next/navigation";

export default function OAuthCompletePage() {
  const locale = useLocale();
  const params = useSearchParams();
  const router = useRouter();
  const status = params.get("status");

  useEffect(() => {
    if (status === "success") {
      router.replace(`/${locale}/account`);
      return;
    }

    const error =
      status === "OAUTH_ACCOUNT_LINK_REQUIRED"
        ? "OAUTH_ACCOUNT_LINK_REQUIRED"
        : status === "oauth_cancelled"
          ? "oauth_cancelled"
          : "oauth_failed";
    router.replace(`/${locale}/auth/login?error=${error}`);
  }, [locale, router, status]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner size="md" />
    </div>
  );
}

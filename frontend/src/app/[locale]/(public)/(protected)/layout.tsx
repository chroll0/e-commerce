"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/state/useAuthStore";
import { AccountDetailsSkeleton } from "@/components";
import { useLocale } from "next-intl";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const locale = useLocale();
  const { user, loading, fetchMe } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${locale}/auth/login`);
    }
  }, [loading, user, router]);

  if (loading) {
    return <AccountDetailsSkeleton />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

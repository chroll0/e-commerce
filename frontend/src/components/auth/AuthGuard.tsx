"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useAuthStore } from "@/state/useAuthStore";

type Props = {
  children: ReactNode;
  role?: string;
  locale?: string;
};

export default function AuthGuard({ children, role, locale }: Props) {
  const router = useRouter();
  const currentLocale = useLocale();
  const { user, loading, fetchMe } = useAuthStore();

  const resolvedLocale = locale ?? currentLocale;

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/${resolvedLocale}/auth/login`);
      return;
    }

    if (role && user.role !== role) {
      router.replace(`/${resolvedLocale}`);
    }
  }, [loading, user, role, resolvedLocale, router]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (role && user.role !== role) {
    return null;
  }

  return <>{children}</>;
}

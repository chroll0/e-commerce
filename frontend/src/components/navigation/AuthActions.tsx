"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const AuthIcons = () => {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const handleLogout = async () => {
    await logout();
    router.replace(`/${locale}`);
  };

  if (loading) return null;

  return (
    <div className="flex items-center gap-4">
      {!user && (
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary" size="sm">
            <Link href={`/${locale}/auth/login`}>{t("auth.login")}</Link>
          </Button>

          <Button asChild variant="primary" size="sm">
            <Link href={`/${locale}/auth/register`}>
              {t("auth.registration")}
            </Link>
          </Button>
        </div>
      )}

      {user && (
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/account`}>
            <div className="p-2 hover:bg-muted rounded-full transition">
              <User className="w-5 h-5 text-primary" />
            </div>
          </Link>

          <Button variant="secondary" size="sm" onClick={handleLogout}>
            {t("auth.logout")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthIcons;

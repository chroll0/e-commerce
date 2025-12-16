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
          <Link href={`/${locale}/auth/login`}>
            <Button variant="secondary" size="sm">
              {t("auth.login")}
            </Button>
          </Link>

          <Link href={`/${locale}/auth/register`}>
            <Button variant="primary" size="sm">
              {t("auth.registration")}
            </Button>
          </Link>
        </div>
      )}

      {user && (
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/account`}>
            <button className="p-2 hover:bg-muted rounded-full transition">
              <User className="w-5 h-5 text-primary" />
            </button>
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

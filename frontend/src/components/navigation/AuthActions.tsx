"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { User } from "lucide-react";
import Link from "next/link";

const AuthIcons = () => {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();

  const accountHref = `/${locale}/account`;
  const normalizedPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
  const accountActive =
    normalizedPath === "/account" || normalizedPath.startsWith("/account/");

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
          <Link href={accountHref}>
            <div
              className={
                "rounded-full p-1.5 transition-colors select-none border " +
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 " +
                (accountActive
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "border-transparent text-muted-foreground hover:bg-muted")
              }
            >
              <User className="w-4.5 h-4.5" />
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

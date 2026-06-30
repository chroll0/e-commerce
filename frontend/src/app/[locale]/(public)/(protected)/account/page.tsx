"use client";

import { useAuthStore } from "@/state/useAuthStore";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AccountHeader,
  AccountProfileCard,
  AccountQuickActions,
  AdminActions,
  Advertisement,
  Button,
} from "@/components";

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();

  const t = useTranslations("account.overview");
  const tAuth = useTranslations("auth");
  const tAdd = useTranslations("advertisements.winterSale");

  if (!user) {
    return null;
  }

  const isAdmin = String(user.role).toLowerCase() === "admin";

  const handleLogout = async () => {
    await logout();
    router.replace(`/${locale}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-10">
      <AccountHeader
        title={t("title")}
        description={t("description")}
        action={
          <Button variant="secondary" onClick={handleLogout} className="w-full">
            {tAuth("logout")}
          </Button>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <AccountProfileCard user={user} />

        <div className="md:col-span-2">
          {isAdmin ? <AdminActions /> : <AccountQuickActions />}
        </div>
      </div>

      <Advertisement
        badge={tAdd("badge")}
        title={tAdd("title")}
        description={tAdd("description")}
        href="/account/settings"
        ctaLabel={tAdd("ctaLabel")}
        variant="default"
        dismissible
        storageKey="profile_tip_dismissed"
        className="mt-8"
      />
    </div>
  );
}

"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AccountHeader,
  AccountProfileCard,
  AccountQuickActions,
  Advertisement,
  Button,
} from "@/components";

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("account.overview");
  const tAuth = useTranslations("auth");

  const handleLogout = async () => {
    await logout();
    router.replace(`/${locale}`);
  };

  if (user)
    return (
      <div className="mx-auto w-full max-w-5xl py-10">
        <AccountHeader
          title={t("title")}
          description={t("description")}
          action={
            <Button variant="secondary" onClick={handleLogout}>
              {tAuth("logout")}
            </Button>
          }
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <AccountProfileCard user={user} />
          <div className="md:col-span-2">
            <AccountQuickActions />
          </div>
        </div>
        <Advertisement
          badge="Tip"
          title="Complete your profile"
          description="Add phone and address to checkout faster."
          href="/account/settings"
          ctaLabel="Update settings"
          variant="default"
          dismissible
          storageKey="profile_tip_dismissed"
          className="mt-8"
        />
      </div>
    );
}

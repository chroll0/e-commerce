"use client";

import {
  AdminPageHeader,
  AdminQuickActions,
  AdminStatsGrid,
} from "@/components";
import { Locale } from "@/i18n/request";
import { useLocale, useTranslations } from "next-intl";

const AdminDashboard = () => {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.dashboard");
  return (
    <>
      <AdminPageHeader title={t("welcome")} description={t("overview")} />
      <AdminStatsGrid locale={locale} />
      <AdminQuickActions locale={locale} />
    </>
  );
};

export default AdminDashboard;

"use client";

import { Advertisement } from "@/components";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("advertisements.winterSale");

  return (
    <main className="w-full max-w-7xl px-4 mt-6 mx-auto">
      <Advertisement
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        href="/deals"
        ctaLabel={t("ctaLabel")}
        variant="promo"
      />
    </main>
  );
};

export default page;

"use client";

import { Breadcrumbs } from "@/components";
import { useLocale, useTranslations } from "next-intl";

const page = () => {
  const locale = useLocale();
  const navT = useTranslations("nav");

  return (
    <main className="w-full max-w-7xl px-4 mt-10 mx-auto">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("sales") },
        ]}
      />

      <div className="py-20 text-center text-muted">
        Sales page content goes here.
      </div>
    </main>
  );
};

export default page;

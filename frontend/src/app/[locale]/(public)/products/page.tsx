"use client";

import {
  Breadcrumbs,
  FeaturedProducts,
  ProductSearchFilters,
} from "@/components";
import { useLocale, useTranslations } from "next-intl";

const page = () => {
  const locale = useLocale();
  const navT = useTranslations("nav");

  return (
    <main className="w-full max-w-7xl px-4 mt-10 mx-auto">
      <Breadcrumbs
        items={[
          { label: "Satori", href: `/${locale}` },
          { label: navT("products"), href: `/${locale}/products` },
        ]}
      />

      <ProductSearchFilters />
      <FeaturedProducts />
    </main>
  );
};

export default page;

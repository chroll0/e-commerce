"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/state/useCartStore";
import { useEffect, useState } from "react";
import { Breadcrumbs, CartItem, CartSummary, EmptyCart } from "@/components";

export default function CartPage() {
  const t = useTranslations("cart");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return <EmptyCart locale={locale} />;
  }

  return (
    <main className="mx-auto mt-10 w-full max-w-7xl px-4 space-y-16">
      <Breadcrumbs
        items={[
          { label: "eShop", href: `/${locale}` },
          { label: navT("cart") },
        ]}
      />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem
              key={`${item.productId}-${item.variantId ?? "default"}`}
              item={item}
            />
          ))}
        </div>

        <CartSummary />
      </div>
    </main>
  );
}

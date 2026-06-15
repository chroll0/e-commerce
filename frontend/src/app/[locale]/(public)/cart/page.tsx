"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCartStore } from "@/state/useCartStore";
import { useEffect, useState } from "react";
import { CartItem, CartSummary, EmptyCart } from "@/components";

export default function CartPage() {
  const t = useTranslations("cart");
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
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
      </div>
    </div>
  );
}

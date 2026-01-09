"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const ITEMS = [
  { key: "orders", href: "/account/orders" },
  { key: "wishlist", href: "/account/wishlist" },
  { key: "addresses", href: "/account/addresses" },
  { key: "support", href: "/support" },
] as const;

export default function AccountQuickActions() {
  const t = useTranslations("account.overview.quickActions");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ITEMS.map((item) => (
        <div
          key={item.key}
          className="group flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]"
        >
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t(`${item.key}.title`)}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              {t(`${item.key}.desc`)}
            </p>
          </div>

          <div className="mt-4">
            <Link
              href={item.href}
              className="w-full inline-flex items-center justify-end text-sm font-medium text-primary hover:underline"
            >
              {t(`${item.key}.action`)}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

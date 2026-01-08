"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";

const ITEMS = [
  { key: "overview", href: "/account" },
  { key: "orders", href: "/account/orders" },
  { key: "wishlist", href: "/account/wishlist" },
  { key: "settings", href: "/account/settings" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const t = useTranslations("account.nav");

  return (
    <nav className="flex items-center md:justify-end flex-wrap gap-2 mb-4 justify-center">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.key}
            href={item.href}
            className={clsx(
              "rounded-md px-2 md:px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-primary text-white"
                : "text-secondary hover:bg-card-soft"
            )}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

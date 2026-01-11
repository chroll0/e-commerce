"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";

const ITEMS = [
  { key: "overview", href: "/account" },
  { key: "orders", href: "/account/orders" },
  { key: "wishlist", href: "/account/wishlist" },
  { key: "settings", href: "/account/settings" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("account.nav");
  const cleanPathname = (pathname.replace(`/${locale}`, "") || "/").replace(
    /\/$/,
    ""
  );

  return (
    <nav className="flex flex-wrap justify-center md:justify-end gap-2 mb-4">
      {ITEMS.map((item) => {
        const isOverview = item.href === "/account";
        const isActive = isOverview
          ? cleanPathname === "/account"
          : cleanPathname === item.href ||
            cleanPathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={clsx(
              // base
              "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium",
              "transition-colors select-none",
              "border",
              // focus
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              // states
              isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
            )}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";

const NavBar = () => {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/shop", label: t("nav.shop") },
    { href: "/categories", label: t("nav.categories") },
    { href: "/deals", label: t("nav.deals") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const normalizedPath =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  const isActive = (href: string) => {
    if (href === "/") return normalizedPath === "/";
    return normalizedPath === href || normalizedPath.startsWith(href + "/");
  };

  return (
    <nav className="flex items-center gap-2">
      {links.map((item) => {
        const active = isActive(item.href);
        const fullHref = `/${locale}${item.href}`;

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={
              "rounded-lg px-4 py-1.5 text-sm font-medium " +
              "transition-colors select-none border focus:outline-none " +
              "focus-visible:ring-2 focus-visible:ring-primary/40 " +
              (active
                ? "bg-primary/10 text-primary border-primary/20"
                : "border-transparent text-muted-foreground hover:bg-muted")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;

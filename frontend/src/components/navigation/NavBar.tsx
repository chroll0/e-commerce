"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const NavBar = () => {
  const t = useTranslations();

  return (
    <nav className="flex items-center gap-6 text-sm font-medium">
      <Link href="/">{t("nav.home")}</Link>
      <Link href="/shop">{t("nav.shop")}</Link>
      <Link href="/categories">{t("nav.categories")}</Link>
      <Link href="/deals">{t("nav.deals")}</Link>
      <Link href="/about">{t("nav.about")}</Link>
      <Link href="/contact">{t("nav.contact")}</Link>
    </nav>
  );
};

export default NavBar;

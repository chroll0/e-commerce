"use client";

import Link from "next/link";
import { Advertisement, LanguageSwitcher } from "@/components";
import { useLocale, useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-card border-t mt-10">
      <div className="px-6 md:px-12 py-12 space-y-10 max-w-400 mx-auto">
        {/* Promo */}
        <Advertisement
          title={t("advertisements.freeDelivery.title")}
          description={t("advertisements.freeDelivery.description")}
          variant="promo"
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          {/* About */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">
              {t("footer.about.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("footer.about.description")}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">
              {t("footer.links.title")}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" locale={locale}>
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/stores" locale={locale}>
                  {t("nav.stores")}
                </Link>
              </li>
              <li>
                <Link href="/products" locale={locale}>
                  {t("nav.products")}
                </Link>
              </li>
              <li>
                <Link href="/sales" locale={locale}>
                  {t("nav.sales")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h3 className="font-semibold text-base">
              {t("footer.support.title")}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/contact" locale={locale}>
                  {t("footer.support.contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" locale={locale}>
                  {t("footer.support.faq")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" locale={locale}>
                  {t("footer.support.privacy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" locale={locale}>
                  {t("footer.support.terms")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} eShop online.{" "}
            {t("footer.bottom.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

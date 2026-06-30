"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Layers,
  PackagePlus,
  Users,
  ExternalLink,
  Boxes,
  ArrowRight,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type ActionKey = "addCategory" | "addProduct" | "viewUsers" | "backToSite";

type Action = {
  key: ActionKey;
  href: (locale: string) => string;
  icon: LucideIcon;
};

const ACTIONS: Action[] = [
  {
    key: "addCategory",
    href: (locale) => `/${locale}/admin/categories/new`,
    icon: Layers,
  },
  {
    key: "addProduct",
    href: (locale) => `/${locale}/admin/products/new`,
    icon: PackagePlus,
  },
  {
    key: "viewUsers",
    href: (locale) => `/${locale}/admin/users`,
    icon: Users,
  },
  {
    key: "backToSite",
    href: (locale) => `/${locale}`,
    icon: ExternalLink,
  },
];

export default function AdminActions() {
  const locale = useLocale();
  const t = useTranslations("admin.dashboard");

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Boxes className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-semibold">{t("quickActions")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("quickActionsDescription")}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ACTIONS.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href(locale)}
            className="
              group rounded-xl border border-border bg-background p-5
              transition-all duration-200
              hover:border-primary/40 hover:shadow-lg hover:-translate-y-1
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                <Icon className="h-5 w-5" />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <h3 className="mt-5 font-semibold">{t(`actions.${key}`)}</h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t(`actions.${key}Description`)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

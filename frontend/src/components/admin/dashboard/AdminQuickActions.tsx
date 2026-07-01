"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Layers,
  PackagePlus,
  Users,
  ExternalLink,
  LucideIcon,
} from "lucide-react";

type ActionKey = "addCategory" | "addProduct" | "viewUsers" | "backToSite";

type Action = {
  key: ActionKey;
  href: (locale: string) => string;
  icon: LucideIcon;
};

const ACTIONS: Action[] = [
  {
    key: "addCategory",
    href: (l) => `/${l}/admin/categories/new`,
    icon: Layers,
  },
  {
    key: "addProduct",
    href: (l) => `/${l}/admin/products/new`,
    icon: PackagePlus,
  },
  {
    key: "viewUsers",
    href: (l) => `/${l}/admin/users`,
    icon: Users,
  },
  {
    key: "backToSite",
    href: (l) => `/${l}`,
    icon: ExternalLink,
  },
];

export default function AdminQuickActions() {
  const locale = useLocale();
  const t = useTranslations("admin.dashboard");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      {/* Header */}
      <div className="text-sm font-medium">{t("quickActions")}</div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map(({ key, href, icon: Icon }) => (
          <Link
            key={key}
            href={href(locale)}
            className="
              inline-flex items-center gap-2
              rounded-md border border-border
              bg-background px-3 py-2
              text-sm font-medium
              transition
              hover:border-primary/40
              hover:bg-muted/30
            "
          >
            <Icon className="h-4 w-4" />
            {t(`actions.${key}`)}
          </Link>
        ))}
      </div>
    </div>
  );
}

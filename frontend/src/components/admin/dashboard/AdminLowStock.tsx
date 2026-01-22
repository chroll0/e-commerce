"use client";

import { FC } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Locale } from "@/types";

type Props = {
  locale: Locale;
  items: { id: number; slug: string; title: string; stock: number }[];
};

const AdminLowStock: FC<Props> = ({ locale, items }) => {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{t("widgets.lowStock")}</div>
        <Link
          href={`/${locale}/admin/products`}
          className="text-xs text-muted-foreground hover:underline"
        >
          {t("view")}
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            {t("widgets.empty")}
          </div>
        ) : (
          items.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-border/60 bg-background/40 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.slug}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-semibold">
                  {t("widgets.stock")}: {p.stock}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminLowStock;

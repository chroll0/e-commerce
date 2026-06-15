"use client";

import Link from "next/link";
import { Button } from "@/components";
import { useTranslations } from "next-intl";
import { ShoppingCartIcon } from "lucide-react";

type Props = {
  locale: string;
};

export default function EmptyCart({ locale }: Props) {
  const t = useTranslations("cart");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
          <ShoppingCartIcon className="h-10 w-10 text-muted" />
        </div>

        <h1 className="text-3xl font-bold text-primary">{t("empty")}</h1>

        <p className="mt-3 text-secondary">{t("emptyDesc")}</p>

        <Link href={`/${locale}/products`} className="mt-8 inline-block">
          <Button size="lg">{t("continueShopping")}</Button>
        </Link>
      </div>
    </div>
  );
}

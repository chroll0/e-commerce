"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components";
import { useCartStore } from "@/state/useCartStore";

export default function CartSummary() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();

  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = items.length ? 9.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="sticky top-4 h-fit rounded-xl border border-border bg-card p-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>{t("subtotal")}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t("shipping")}</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>{t("tax")}</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 border-t pt-4 flex justify-between font-bold">
        <span>{t("total")}</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <div className="mt-6 space-y-2">
        <Button fullWidth onClick={() => router.push(`/${locale}/checkout`)}>
          {t("checkout")}
        </Button>

        <Button fullWidth variant="outline" onClick={clearCart}>
          {t("clearCart")}
        </Button>
      </div>
    </div>
  );
}

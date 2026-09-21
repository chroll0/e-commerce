"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components";
import { useCartStore } from "@/state/useCartStore";
import { useCartActions } from "@/state/useCartActions";
import { useNotificationStore } from "@/state/useNotificationStore";

import { ShieldCheckIcon, TruckIcon, CreditCardIcon } from "lucide-react";

type CartSummaryProps = {
  mode?: "cart" | "checkout";
  items?: ReturnType<typeof useCartStore.getState>["items"];
  totalOverride?: number;
};

export default function CartSummary({
  mode = "cart",
  items: itemsOverride,
  totalOverride,
}: CartSummaryProps) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();

  const cartItems = useCartStore((s) => s.items);
  const { clear } = useCartActions();
  const notify = useNotificationStore((state) => state.push);

  const items = itemsOverride ?? cartItems;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = totalOverride !== undefined ? totalOverride : subtotal;

  const hasStockWarning = items.some(
    (item) =>
      item.availableStock !== undefined &&
      (item.availableStock <= 0 || item.quantity > item.availableStock),
  );

  const isCheckout = mode === "checkout";

  return (
    <div className="sticky top-4 h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">{t("summary")}</h2>

        <p className="mt-1 text-sm text-secondary">
          {itemCount} {t("totalItems")}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">{t("subtotal")}</span>

          <span className="font-medium">₾{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary">{t("shipping")}</span>

          <span className="font-medium text-primary">{t("free")}</span>
        </div>
      </div>

      {/* TOTAL */}
      <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
        <span className="text-base font-semibold">{t("total")}</span>

        <span className="text-2xl font-bold text-primary">
          ₾{total.toFixed(2)}
        </span>
      </div>

      {/* TRUST */}
      <div className="mt-5 space-y-2 rounded-xl border border-border bg-card-soft p-4">
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheckIcon className="h-4 w-4 shrink-0" />
          <span>{t("secureCheckout")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CreditCardIcon className="h-4 w-4 shrink-0" />
          <span>{t("encryptedPayments")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <TruckIcon className="h-4 w-4 shrink-0" />
          <span>{t("fastDelivery")}</span>
        </div>
      </div>

      {/* CART ACTIONS */}
      {!isCheckout && (
        <div className="mt-6 space-y-3">
          {hasStockWarning && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm text-primary">
              {t("stockWarning")}
            </div>
          )}

          <Button
            size="lg"
            fullWidth
            onClick={() => {
              if (hasStockWarning) {
                notify("info", t("stockWarning"));
                return;
              }

              router.push(`/${locale}/checkout`);
            }}
          >
            {t("checkout")}
          </Button>

          <Button
            variant="outline"
            fullWidth
            onClick={() => router.push(`/${locale}/products`)}
          >
            {t("continueShopping")}
          </Button>

          <Button variant="text" fullWidth onClick={clear}>
            {t("clearCart")}
          </Button>
        </div>
      )}
    </div>
  );
}

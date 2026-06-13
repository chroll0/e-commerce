"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/state/useCartStore";
import { useAuthStore } from "@/state/useAuthStore";
import { Button } from "@/components";
import Image from "next/image";
import { Trash2Icon, MinusIcon, PlusIcon } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();

  const user = useAuthStore((s) => s.user);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items],
  );

  const totalItems = useMemo(
    () => items.reduce((s, i) => s + i.quantity, 0),
    [items],
  );

  const shipping = items.length ? 9.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("empty")}</h1>
          <Link href={`/${locale}/products`}>
            <Button>{t("continueShopping")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">{t("title")}</h1>

          <button
            onClick={clearCart}
            className="text-sm text-muted hover:text-red-500"
          >
            {t("clearCart")}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex gap-4 border rounded-xl p-4"
              >
                <div className="relative w-24 h-24">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted text-xs">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1,
                        )
                      }
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1,
                        )
                      }
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  <Trash2Icon />
                </button>
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="border rounded-xl p-6 h-fit sticky top-4">
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

            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
              <span>{t("total")}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button
              className="w-full mt-6"
              onClick={() => router.push(`/${locale}/checkout`)}
            >
              {t("checkout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

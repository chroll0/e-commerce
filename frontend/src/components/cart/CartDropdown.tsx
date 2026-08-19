"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ImageIcon, Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components";
import { api } from "@/lib/axios";
import { useCartActions } from "@/state/useCartActions";
import { useCartStore, type CartItem } from "@/state/useCartStore";

type Props = {
  onClose: () => void;
};

function itemKey(item: CartItem) {
  return `${item.productId}-${item.variantId ?? "default"}`;
}

export default function CartDropdown({ onClose }: Props) {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal)();
  const itemCount = useCartStore((state) => state.totalItems)();
  const { remove, update } = useCartActions();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [displayNames, setDisplayNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((item) => [itemKey(item), item.name])),
  );
  const [namesLocale, setNamesLocale] = useState(locale);

  useEffect(() => {
    let isCancelled = false;

    const refreshNames = async () => {
      const results = await Promise.all(
        items.map(async (item) => {
          try {
            const response = await api.get(`/products/${item.productId}`, {
              params: { locale },
            });
            const product = response.data;
            const name =
              product?.translations?.find(
                (translation: { locale?: string; title?: string }) =>
                  translation.locale === locale,
              )?.title ??
              product?.name ??
              item.name;

            return [itemKey(item), name] as const;
          } catch {
            return [itemKey(item), item.name] as const;
          }
        }),
      );

      if (!isCancelled) {
        setDisplayNames(Object.fromEntries(results));
        setNamesLocale(locale);
      }
    };

    void refreshNames();

    return () => {
      isCancelled = true;
    };
  }, [items, locale]);

  const handleUpdate = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;

    const key = itemKey(item);
    setBusyKey(key);
    try {
      await update(item.productId, item.variantId, quantity);
    } finally {
      setBusyKey(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    const key = itemKey(item);
    setBusyKey(key);
    try {
      await remove(item.productId, item.variantId);
    } finally {
      setBusyKey(null);
    }
  };

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="absolute -right-11 top-full z-50 mt-3 w-[calc(100vw-3rem)] max-w-100 overflow-hidden rounded-2xl border border-border bg-card shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-200 sm:right-0 sm:w-[min(25rem,calc(100vw-2rem))]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("itemsCount", { count: itemCount })}
          </p>
        </div>
        <Button
          type="button"
          variant="text"
          size="sm"
          iconOnly
          aria-label={t("close")}
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <ShoppingCart className="mx-auto h-9 w-9 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">{t("empty")}</p>
          <Link
            href={`/${locale}/products`}
            onClick={onClose}
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            {t("continueShopping")}
          </Link>
        </div>
      ) : (
        <div className="max-h-[min(24rem,55vh)] overflow-y-auto">
          {items.map((item) => {
            const key = itemKey(item);
            const isBusy = busyKey === key;
            const displayName = displayNames[key];
            const accessibleName = displayName ?? item.name;
            const isNameReady = namesLocale === locale && !!displayName;

            return (
              <div
                key={key}
                className="flex gap-3 border-b border-border px-4 py-3 last:border-b-0"
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-card-soft text-center">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={accessibleName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="m-auto h-5 w-5 text-muted" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {isNameReady ? (
                      displayName
                    ) : (
                      <span
                        className="block h-4 w-3/4 animate-pulse rounded bg-muted"
                        aria-hidden="true"
                      />
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ₾{item.price.toFixed(2)}
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      iconOnly
                      aria-label={t("decreaseQuantity", {
                        name: accessibleName,
                      })}
                      disabled={isBusy || item.quantity <= 1}
                      loading={isBusy}
                      onClick={() => void handleUpdate(item, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span
                      className="min-w-6 text-center text-xs"
                      aria-label={t("quantity")}
                    >
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      iconOnly
                      aria-label={t("increaseQuantity", {
                        name: accessibleName,
                      })}
                      disabled={isBusy}
                      loading={isBusy}
                      onClick={() => void handleUpdate(item, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                  <span className="text-sm font-semibold text-primary">
                    ₾{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <Button
                    type="button"
                    variant="text"
                    size="xs"
                    iconOnly
                    aria-label={t("removeItem", { name: accessibleName })}
                    disabled={isBusy}
                    loading={isBusy}
                    onClick={() => void handleRemove(item)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 && (
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="font-semibold">₾{subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navigateTo(`/${locale}/cart`)}
            >
              {t("viewCart")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => navigateTo(`/${locale}/checkout`)}
            >
              {t("checkout")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

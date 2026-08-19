"use client";

import {
  AuthActions,
  Logo,
  ThemeToggle,
  NavBar,
  RunningText,
  Button,
  NotificationBell,
  CartDropdown,
} from "@/components";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/state/useCartStore";

const Navigation = () => {
  const t = useTranslations("cart");
  const cartRef = useRef<HTMLDivElement>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const itemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  useEffect(() => {
    if (!cartOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!cartRef.current?.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCartOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [cartOpen]);

  return (
    <div className="flex h-full flex-col">
      {/* TOP BAR */}
      <div className="border-b border-border px-6 py-2.5 md:px-12">
        <div className="mx-auto flex w-full max-w-400 items-center justify-between">
          <NavBar />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthActions />
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <div className="border-b border-border px-6 py-1.5 md:px-12">
        <div className="mx-auto flex w-full max-w-400 items-center justify-between gap-6">
          {/* LOGO */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* RUNNING TEXT */}
          <div className="hidden flex-1 overflow-hidden sm:block">
            <RunningText />
          </div>

          {/* ACTIONS */}
          <div className="flex shrink-0 items-center gap-2">
            {/* CART */}
            <div ref={cartRef} className="relative">
              <Button
                variant="outline"
                size="sm"
                iconOnly
                className="relative"
                aria-label={t("open")}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen((current) => !current)}
              >
                <ShoppingCart className="h-6 w-6" />

                {itemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-white">
                    {itemsCount > 99 ? "99+" : itemsCount}
                  </span>
                )}
              </Button>

              {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
            </div>

            {/* NOTIFICATIONS */}
            <NotificationBell />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

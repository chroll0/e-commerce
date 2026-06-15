"use client";

import Link from "next/link";
import {
  AuthActions,
  Logo,
  ThemeToggle,
  NavBar,
  RunningText,
  Button,
} from "@/components";
import { Bell, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/state/useCartStore";

const Navigation = () => {
  const itemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

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
            <Link href="/cart">
              <Button
                variant="outline"
                size="sm"
                iconOnly
                className="relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />

                {itemsCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-white">
                    {itemsCount > 99 ? "99+" : itemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* NOTIFICATIONS */}
            <Button
              variant="outline"
              size="sm"
              iconOnly
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

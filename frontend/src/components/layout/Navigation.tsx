"use client";

import {
  AuthActions,
  Logo,
  ThemeToggle,
  NavBar,
  RunningText,
} from "@/components";
import { Bell, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/state/useCartStore";
import Link from "next/link";

const Navigation = () => {
  const itemsCount = useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  return (
    <div className="flex flex-col h-full">
      <div className="py-2.5 px-6 md:px-12 border-b border-border">
        <div className="max-w-400 mx-auto w-full flex items-center justify-between">
          <NavBar />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthActions />
          </div>
        </div>
      </div>

      <div className="py-1.5 px-6 md:px-12 border-b border-border gap-6">
        <div className="flex items-center justify-between max-w-400 mx-auto w-full gap-6">
          <div className="shrink-0">
            <Logo />
          </div>

          <div className="flex-1 overflow-hidden sm:block hidden">
            <RunningText />
          </div>

          <div className="flex shrink-0 items-center gap-4 text-foreground">
            <Link
              href="/cart"
              className="relative flex items-center gap-4 hover:text-primary transition"
            >
              <ShoppingCart className="h-5 w-5" />

              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-px text-[10px] text-white bg-destructive rounded-full px-1.5 py-0.5">
                  {itemsCount}
                </span>
              )}

              <div>|</div>
            </Link>

            <div className="cursor-pointer transition hover:text-primary">
              <Bell className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

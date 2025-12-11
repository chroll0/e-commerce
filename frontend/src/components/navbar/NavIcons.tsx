"use client";

import { Button } from "@/components";
import { ShoppingCart, Heart, Search, User, Home } from "lucide-react";
import Link from "next/link";

const NavIcons = () => {
  // later: const { user } = useAuth();
  const user = null; // TEMP: change when auth is ready

  return (
    <div className="flex items-center gap-4">
      {/* home */}
      <Link className="p-2 hover:bg-muted rounded-full transition" href="/">
        <Home className="w-5 h-5 text-primary" />
      </Link>
      {/* Search */}
      <button className="p-2 hover:bg-muted rounded-full transition">
        <Search className="w-5 h-5 text-primary" />
      </button>

      {/* Wishlist */}
      <button className="p-2 hover:bg-muted rounded-full transition">
        <Heart className="w-5 h-5 text-primary" />
      </button>

      {/* Cart */}
      <Link
        href="/cart"
        className="relative p-2 hover:bg-muted rounded-full transition"
      >
        <ShoppingCart className="w-5 h-5 text-primary" />

        {/* Badge */}
        <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          0
        </span>
      </Link>

      {/* If NOT logged in → Show Sign In + Sign Up */}
      {!user && (
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="secondary" size="sm">
              Sign In
            </Button>
          </Link>

          <Link href="/auth/register">
            <Button variant="primary" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      )}

      {/* If logged in → Show User Icon */}
      {user && (
        <Link href="/account">
          <button className="p-2 hover:bg-muted rounded-full transition">
            <User className="w-5 h-5 text-primary" />
          </button>
        </Link>
      )}
    </div>
  );
};

export default NavIcons;

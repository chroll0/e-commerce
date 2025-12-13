"use client";

import { Button } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";
import { ShoppingCart, Heart, Search, User, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavIcons = () => {
  const { user, loading, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Home */}
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
        <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          0
        </span>
      </Link>

      {/* NOT logged in */}
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

      {/* Logged in */}
      {user && (
        <div>
          <Link href="/pages/account">
            <button className="p-2 hover:bg-muted rounded-full transition">
              <User className="w-5 h-5 text-primary" />
            </button>
          </Link>

          {/* Sign Out */}
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavIcons;

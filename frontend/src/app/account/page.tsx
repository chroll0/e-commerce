"use client";

import Link from "next/link";
import { Button } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";

function Avatar({ name }: { name: string }) {
  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  return (
    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
      {initial}
    </div>
  );
}

export default function AccountPage() {
  const { user, loading, logout } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 flex items-center justify-center">
        <div className="w-full max-w-md p-6 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
          <p className="text-center text-secondary">Loading account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-2xl border border-border shadow-[0_4px_18px_var(--color-shadow)]">
          <h1 className="text-2xl font-bold text-primary text-center">
            Account
          </h1>

          <p className="mt-3 text-center text-secondary">
            You’re not logged in.
          </p>

          <div className="mt-6 flex gap-3">
            <Link className="w-full" href="/auth/login">
              <Button variant="primary" fullWidth>
                Sign In
              </Button>
            </Link>

            <Link className="w-full" href="/auth/register">
              <Button variant="secondary" fullWidth>
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4">
      <div className="mx-auto w-full max-w-5xl py-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">My Account</h1>
            <p className="text-secondary mt-1">
              Manage your profile and orders.
            </p>
          </div>

          <Button variant="secondary" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="md:col-span-1 p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
            <div className="flex items-center gap-4">
              <Avatar name={user.name} />

              <div className="min-w-0">
                <p className="text-lg font-semibold text-primary truncate">
                  {user.name}
                </p>
                <p className="text-sm text-secondary truncate">{user.email}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-secondary">Role</span>
              <span className="text-sm font-medium text-primary">
                {user.role}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Link href="/account/settings">
                <Button variant="outline" fullWidth>
                  Settings
                </Button>
              </Link>

              <Link href="/orders">
                <Button variant="primary" fullWidth>
                  My Orders
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
              <h2 className="text-lg font-semibold text-primary">
                Recent Orders
              </h2>
              <p className="text-sm text-secondary mt-2">
                You’ll see your latest orders here once you place them.
              </p>

              <div className="mt-4">
                <Link href="/orders">
                  <Button variant="secondary">View Orders</Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
              <h2 className="text-lg font-semibold text-primary">Wishlist</h2>
              <p className="text-sm text-secondary mt-2">
                Save products you like and buy later.
              </p>

              <div className="mt-4">
                <Link href="/wishlist">
                  <Button variant="secondary">Open Wishlist</Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
              <h2 className="text-lg font-semibold text-primary">Addresses</h2>
              <p className="text-sm text-secondary mt-2">
                Add delivery addresses for faster checkout.
              </p>

              <div className="mt-4">
                <Link href="/account/settings">
                  <Button variant="secondary">Manage Addresses</Button>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
              <h2 className="text-lg font-semibold text-primary">Support</h2>
              <p className="text-sm text-secondary mt-2">
                Need help? Contact our support team.
              </p>

              <div className="mt-4">
                <Link href="/support">
                  <Button variant="secondary">Contact Support</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-secondary">
          Tip: If you delete a user from the database, the session will be
          cleared after the next /auth/me check.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import {
  AccountHeader,
  AccountProfileCard,
  AccountQuickActions,
} from "@/components";

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  if (user)
    return (
      <div className="min-h-screen bg-background px-4">
        <div className="mx-auto w-full max-w-5xl py-10">
          <AccountHeader onLogout={logout} />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <AccountProfileCard user={user} />
            <div className="md:col-span-2">
              <AccountQuickActions />
            </div>
          </div>
        </div>
      </div>
    );
}

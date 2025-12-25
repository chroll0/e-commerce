import Link from "next/link";
import { User } from "@/stores/useAuthStore";
import { Avatar, Button } from "@/components";

export default function AccountProfileCard({ user }: { user: User }) {
  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
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
        <span className="text-sm font-medium text-primary">{user.role}</span>
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
  );
}

import Link from "next/link";
import { User } from "@/stores/useAuthStore";
import { Avatar, Button } from "@/components";
import { useLocale } from "next-intl";

export default function AccountProfileCard({ user }: { user: User }) {
  const locale = useLocale();

  const joinedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  return (
    <div className="p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={user.name} />

        <div className="min-w-0">
          <p className="text-lg font-semibold text-foreground truncate">
            {user.name}
          </p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Role" value={user.role} />
        <InfoRow label="Phone" value={user.phone ?? "—"} />
        <InfoRow label="Joined" value={joinedDate} />
      </div>

      {/* Action */}
      <div className="mt-8">
        <Button asChild variant="outline" fullWidth>
          <Link href="/account/settings">Settings</Link>
        </Button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>

      <span className="text-sm font-medium text-foreground min-w-0 truncate text-right">
        {value}
      </span>
    </div>
  );
}

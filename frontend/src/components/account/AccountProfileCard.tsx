import Link from "next/link";
import { User } from "@/stores/useAuthStore";
import { Avatar, Button } from "@/components";
import { useLocale, useTranslations } from "next-intl";

export default function AccountProfileCard({ user }: { user: User }) {
  const t = useTranslations("account");
  const locale = useLocale();
  const joinedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={user.name} />
        <p className="text-lg font-semibold text-foreground truncate capitalize">
          {user.name}
        </p>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3">
        <InfoRow label={t("profile.email")} value={user.email} />
        <InfoRow label={t("profile.role")} value={user.role} />
        <InfoRow label={t("profile.phone")} value={user.phone ?? "—"} />
        <InfoRow label={t("profile.joined")} value={joinedDate} />
      </div>

      {/* Action */}
      <div className="mt-6">
        <Button asChild variant="outline" fullWidth>
          <Link href="/account/settings">{t("nav.settings")}</Link>
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

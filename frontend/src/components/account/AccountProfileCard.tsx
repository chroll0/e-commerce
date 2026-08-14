import Link from "next/link";
import { User } from "@/state/useAuthStore";
import { Avatar, Button } from "@/components";
import { useLocale, useTranslations } from "next-intl";
import {
  Mail,
  ShieldCheck,
  Phone,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

export default function AccountProfileCard({ user }: { user: User }) {
  const t = useTranslations("account");
  const locale = useLocale();

  const joinedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  const isAdmin = String(user.role).toLowerCase() === "admin";

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-border bg-card shadow-[0_4px_18px_var(--color-shadow)]">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar name={user.name} />
        <p className="text-lg font-semibold text-foreground truncate capitalize">
          {user.name}
        </p>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3">
        <InfoRow icon={Mail} label={t("profile.email")} value={user.email} />
        <InfoRow
          icon={ShieldCheck}
          label={t("profile.role")}
          value={user.role}
        />
        <InfoRow
          icon={Phone}
          label={t("profile.phone")}
          value={user.phone ?? "—"}
        />
        <InfoRow
          icon={CalendarDays}
          label={t("profile.joined")}
          value={joinedDate}
        />
      </div>

      {/* Action */}
      <div className="mt-8 flex flex-col gap-4">
        {isAdmin && (
          <Button asChild variant="primary" fullWidth type="button">
            <Link href={`/${locale}/admin/dashboard`}>{t("nav.admin")}</Link>
          </Button>
        )}

        <Button asChild variant="outline" fullWidth type="button">
          <Link href={`/${locale}/account/settings`}>{t("nav.settings")}</Link>
        </Button>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="size-4 shrink-0" aria-hidden="true" />
        {label}
      </span>
      <span className="text-sm font-medium text-foreground min-w-0 truncate text-right">
        {value}
      </span>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { AccountHeader, Button, Input } from "@/components";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/state/useAuthStore";
import { useNotificationStore } from "@/state/useNotificationStore";

type ApiError = {
  response?: { data?: { message?: string | string[] } };
};

function getApiMessage(error: unknown, fallback: string) {
  const message = (error as ApiError)?.response?.data?.message;
  return Array.isArray(message) ? message[0] : message || fallback;
}

export default function SettingsPage() {
  const t = useTranslations("account.settings");
  const locale = useLocale();
  const router = useRouter();
  const { user, fetchMe, logout } = useAuthStore();
  const notify = useNotificationStore((state) => state.push);

  const [name, setName] = useState(() => user?.name ?? "");
  const [phone, setPhone] = useState(() => user?.phone ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  if (!user) return null;

  const joinedDate = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(user.createdAt);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profileSaving) return;

    setProfileSaving(true);
    try {
      await api.patch("/users/me", {
        name: name.trim(),
        phone: phone.trim() || null,
      });
      await fetchMe(true);
      notify("success", t("profileSuccess"));
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passwordSaving) return;

    if (newPassword !== confirmPassword) {
      notify("error", t("passwordMismatch"));
      return;
    }

    setPasswordSaving(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      await logout();
      notify("success", t("passwordSuccess"));
      router.replace(`/${locale}/auth/login`);
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl py-10">
      <AccountHeader title={t("title")} description={t("description")} />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {t("profileSection")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("profileDescription")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleProfileSubmit}>
              <Input
                label={t("name")}
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
                autoComplete="name"
              />
              <Input
                label={t("email")}
                value={user.email}
                readOnly
                disabled
                fullWidth
                autoComplete="email"
              />
              <p className="-mt-3 text-xs text-muted-foreground">
                {t("emailReadOnly")}
              </p>
              <Input
                label={t("phone")}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                fullWidth
                autoComplete="tel"
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  loading={profileSaving}
                  disabled={!name.trim()}
                >
                  {t("save")}
                </Button>
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {t("securitySection")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("securityDescription")}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handlePasswordSubmit}>
              <Input
                label={t("currentPassword")}
                type="password"
                passwordToggle
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                fullWidth
                autoComplete="current-password"
              />
              <Input
                label={t("newPassword")}
                type="password"
                passwordToggle
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                fullWidth
                autoComplete="new-password"
              />
              <Input
                label={t("confirmPassword")}
                type="password"
                passwordToggle
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={8}
                fullWidth
                autoComplete="new-password"
              />

              <div className="flex justify-end pt-2">
                <Button type="submit" loading={passwordSaving}>
                  {t("changePassword")}
                </Button>
              </div>
            </form>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">
            {t("accountInformation")}
          </h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">{t("accountEmail")}</dt>
              <dd className="max-w-40 truncate text-right font-medium">
                {user.email}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">{t("role")}</dt>
              <dd className="font-medium">{user.role}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">{t("memberSince")}</dt>
              <dd className="text-right font-medium">{joinedDate}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

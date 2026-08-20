"use client";

import { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  AccountHeader,
  Button,
  ConfirmModal,
  Input,
  Modal,
  Spinner,
} from "@/components";
import { accountApi } from "@/lib/accountApi";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/state/useAuthStore";
import { useNotificationStore } from "@/state/useNotificationStore";
import type { Address, AddressInput, UserPreferences } from "@/types/account";

type ApiError = { response?: { data?: { message?: string | string[] } } };
const emptyAddress: AddressInput = {
  title: "",
  firstName: "",
  lastName: "",
  phone: "",
  country: "Georgia",
  city: "",
  address: "",
  apartment: "",
  postalCode: "",
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressInput>(emptyAddress);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([accountApi.listAddresses(), accountApi.getPreferences()])
      .then(([nextAddresses, nextPreferences]) => {
        if (!active) return;
        setAddresses(nextAddresses);
        setPreferences(nextPreferences);
      })
      .catch((error) => {
        if (active) notify("error", getApiMessage(error, t("error")));
      })
      .finally(() => {
        if (active) setLoadingData(false);
      });
    return () => {
      active = false;
    };
  }, [notify, t]);

  if (!user) return null;
  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
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

  const savePassword = async (event: FormEvent<HTMLFormElement>) => {
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

  const openAddress = (address?: Address) => {
    setEditingAddressId(address?.id ?? null);
    setAddressForm(address ? { ...address } : { ...emptyAddress });
    setAddressModalOpen(true);
  };
  const saveAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (addressSaving) return;
    setAddressSaving(true);
    try {
      const saved = editingAddressId
        ? await accountApi.updateAddress(editingAddressId, addressForm)
        : await accountApi.createAddress(addressForm);
      setAddresses((current) =>
        editingAddressId
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [
              saved,
              ...current.map((item) =>
                saved.isDefault ? { ...item, isDefault: false } : item,
              ),
            ],
      );
      setAddressModalOpen(false);
      notify("success", t("addressSaved"));
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    } finally {
      setAddressSaving(false);
    }
  };
  const setDefaultAddress = async (id: number) => {
    try {
      await accountApi.setDefaultAddress(id);
      setAddresses((current) =>
        current.map((item) => ({ ...item, isDefault: item.id === id })),
      );
      notify("success", t("addressDefaultSuccess"));
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    }
  };
  const deleteAddress = async (id: number) => {
    try {
      await accountApi.deleteAddress(id);
      setAddresses(await accountApi.listAddresses());
      notify("success", t("addressDeleted"));
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    }
  };
  const updatePreference = async (input: Partial<UserPreferences>) => {
    if (!preferences || preferencesSaving) return;
    const previous = preferences;
    const next = { ...preferences, ...input };
    setPreferences(next);
    setPreferencesSaving(true);
    try {
      setPreferences(
        await accountApi.updatePreferences({
          language: next.language,
          emailNotifications: next.emailNotifications,
          orderNotifications: next.orderNotifications,
          marketingEmails: next.marketingEmails,
        }),
      );
    } catch (error) {
      setPreferences(previous);
      notify("error", getApiMessage(error, t("error")));
    } finally {
      setPreferencesSaving(false);
    }
  };
  const deleteAccount = async () => {
    if (!deletePassword || deletingAccount) return;
    setDeletingAccount(true);
    try {
      await accountApi.deleteAccount(deletePassword);
      await logout();
      router.replace(`/${locale}`);
    } catch (error) {
      notify("error", getApiMessage(error, t("error")));
    } finally {
      setDeletingAccount(false);
    }
  };

  const fields = [
    "title",
    "firstName",
    "lastName",
    "phone",
    "country",
    "city",
    "address",
    "apartment",
    "postalCode",
  ] as const;
  const preferenceKeys = [
    "emailNotifications",
    "orderNotifications",
    "marketingEmails",
  ] as const;
  return (
    <div className="mx-auto w-full max-w-5xl py-10">
      <AccountHeader title={t("title")} description={t("description")} />
      <div className="mt-8 space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t("profileSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("profileDescription")}
          </p>
          <form
            className="mt-6 grid gap-5 md:grid-cols-2"
            onSubmit={saveProfile}
          >
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
            <Input
              label={t("phone")}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              fullWidth
              autoComplete="tel"
            />
            <p className="self-end text-xs text-muted-foreground">
              {t("emailReadOnly")}
            </p>
            <div className="md:col-span-2 flex justify-end">
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{t("addressesSection")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("addressesDescription")}
              </p>
            </div>
            <Button type="button" onClick={() => openAddress()}>
              {t("addAddress")}
            </Button>
          </div>
          {loadingData ? (
            <div className="flex justify-center py-10">
              <Spinner size="md" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {t("addressesEmpty")}
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">
                        {address.title ||
                          `${address.firstName} ${address.lastName}`}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {address.address}, {address.city}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.phone}
                      </p>
                    </div>
                    {address.isDefault && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {t("defaultAddress")}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openAddress(address)}
                    >
                      {t("editAddress")}
                    </Button>
                    {!address.isDefault && (
                      <Button
                        type="button"
                        variant="text"
                        size="sm"
                        onClick={() => void setDefaultAddress(address.id)}
                      >
                        {t("setDefault")}
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="text"
                      size="sm"
                      onClick={() => void deleteAddress(address.id)}
                    >
                      {t("deleteAddress")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t("preferencesSection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("preferencesDescription")}
          </p>
          {preferences && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <span className="text-sm font-medium">{t("language")}</span>
                <select
                  className="rounded border border-border bg-card px-3 py-2 text-sm"
                  value={preferences.language}
                  disabled={preferencesSaving}
                  onChange={(event) =>
                    void updatePreference({ language: event.target.value })
                  }
                >
                  <option value="en">English</option>
                  <option value="ka">ქართული</option>
                </select>
              </label>
              {preferenceKeys.map((key) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border p-4"
                >
                  <span className="text-sm font-medium">{t(key)}</span>
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-primary"
                    checked={preferences[key]}
                    disabled={preferencesSaving}
                    onChange={(event) =>
                      void updatePreference({ [key]: event.target.checked })
                    }
                  />
                </label>
              ))}
            </div>
          )}
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">{t("securitySection")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("securityDescription")}
          </p>
          <form
            className="mt-6 grid gap-5 md:grid-cols-3"
            onSubmit={savePassword}
          >
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
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" loading={passwordSaving}>
                {t("changePassword")}
              </Button>
            </div>
          </form>
        </section>
        <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="text-xl font-semibold text-destructive">
            {t("dangerZone")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("deleteAccountDescription")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-destructive text-destructive"
            onClick={() => setDeleteAccountOpen(true)}
          >
            {t("deleteAccount")}
          </Button>
        </section>
      </div>
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddressId ? t("editAddress") : t("addAddress")}
        size="lg"
      >
        <form className="grid gap-5 md:grid-cols-2" onSubmit={saveAddress}>
          {fields.map((key) => (
            <Input
              key={key}
              label={t(key === "title" ? "addressTitle" : key)}
              value={addressForm[key] ?? ""}
              onChange={(event) =>
                setAddressForm((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              required={
                !(
                  ["title", "country", "apartment", "postalCode"] as string[]
                ).includes(key)
              }
              fullWidth
            />
          ))}
          <div className="md:col-span-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAddressModalOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" loading={addressSaving}>
              {t("save")}
            </Button>
          </div>
        </form>
      </Modal>
      <ConfirmModal
        isOpen={deleteAccountOpen}
        loading={deletingAccount}
        onClose={() => setDeleteAccountOpen(false)}
        onConfirm={() => void deleteAccount()}
        title={t("deleteAccountConfirmTitle")}
        description={
          <div>
            <p>{t("deleteAccountConfirmDescription")}</p>
            <Input
              className="mt-5"
              label={t("currentPassword")}
              type="password"
              passwordToggle
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              fullWidth
            />
          </div>
        }
        cancelLabel={t("cancel")}
        confirmLabel={t("deleteAccount")}
      />
    </div>
  );
}

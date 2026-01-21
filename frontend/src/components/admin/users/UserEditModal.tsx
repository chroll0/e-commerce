"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { UserApi } from "@/types";
import { Button, Input, Modal } from "@/components";

type Props = {
  isOpen: boolean;
  user: UserApi | null;
  saving: boolean;
  onClose: () => void;
  onSave: (next: { name?: string; phone?: string; role?: string }) => void;
};

export default function UserEditModal({
  isOpen,
  user,
  saving,
  onClose,
  onSave,
}: Props) {
  const t = useTranslations("admin.users");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setPhone(user.phone ?? "");
    setRole((user.role as any) === "ADMIN" ? "ADMIN" : "USER");
  }, [user]);

  const submit = () => {
    if (!user) return;
    onSave({
      name: name.trim() || null,
      phone: phone.trim() || null,
      role,
    } as any);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="p-6 space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{t("editModal.title")}</h2>
          {user?.email && (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          )}
        </div>

        <div className="space-y-4">
          <Input
            label={t("editModal.fields.name")}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label={t("editModal.fields.phone")}
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="w-full">
            <label className="text-sm font-medium text-secondary">
              {t("editModal.fields.role")}
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="USER">{t("roles.user")}</option>
              <option value="ADMIN">{t("roles.admin")}</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("actions.cancel")}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={submit}
            disabled={saving}
          >
            {saving ? t("editModal.saving") : t("actions.save")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

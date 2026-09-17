"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AdminPageHeader,
  Button,
  ConfirmModal,
  Input,
  LabelsTable,
  slugify,
} from "@/components";
import { createLabel, deleteLabel, getLabels } from "@/lib/labelsApi";
import type { ProductLabelApi } from "@/types";

export default function AdminLabelsPage() {
  const t = useTranslations("admin.labels");

  const [labels, setLabels] = useState<ProductLabelApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null,
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLabels();
      setLabels(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn));
  }, [nameEn, slugTouched]);

  const resetForm = () => {
    setNameEn("");
    setNameKa("");
    setSlug("");
    setSlugTouched(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameKa.trim() || !slug.trim()) {
      setCreateError(t("messages.required"));
      return;
    }

    try {
      setCreating(true);
      setCreateError("");
      await createLabel({
        nameEn: nameEn.trim(),
        nameKa: nameKa.trim(),
        slug: slug.trim(),
      });
      resetForm();
      await load();
    } catch (e: any) {
      setCreateError(e?.response?.data?.message || t("messages.createError"));
    } finally {
      setCreating(false);
    }
  };

  const onRequestDelete = (payload: { id: number; name: string }) => {
    setTarget(payload);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!target) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");
      await deleteLabel(target.id);
      closeDelete();
      await load();
    } catch (e: any) {
      setDeleteError(e?.response?.data?.message || t("messages.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminPageHeader title={t("title")} description={t("description")} />

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border p-6 md:grid-cols-3"
      >
        <Input
          label={t("fields.nameEn")}
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          fullWidth
        />

        <Input
          label={t("fields.nameKa")}
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          fullWidth
        />

        <Input
          label={t("fields.slug")}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          fullWidth
        />

        {createError && (
          <div className="md:col-span-3 text-sm text-destructive">
            {createError}
          </div>
        )}

        <div className="md:col-span-3 flex justify-end">
          <Button type="submit" variant="primary" disabled={creating}>
            {creating ? t("actions.creating") : t("actions.create")}
          </Button>
        </div>
      </form>

      <LabelsTable
        loading={loading}
        labels={labels}
        onRequestDelete={onRequestDelete}
        labelsText={{
          name: t("table.name"),
          slug: t("table.slug"),
          actions: t("table.actions"),
          loading: t("table.loading"),
          empty: t("table.empty"),
          delete: t("actions.delete"),
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        title={t("modal.deleteTitle")}
        description={
          deleteError ||
          t("modal.deleteDescription", { name: target?.name ?? "" })
        }
        cancelLabel={t("actions.cancel")}
        confirmLabel={t("actions.delete")}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}

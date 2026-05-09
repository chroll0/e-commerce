"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { AdminPageHeader, Button, ConfirmModal } from "@/components";
import { StoreApi, Locale } from "@/types";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminStoresPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.stores");

  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null,
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/stores");
      setStores(res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const closeDelete = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!target) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");
      await api.delete(`/stores/${target.id}`);
      setStores((prev) => prev.filter((s) => s.id !== target.id));
      closeDelete();
    } catch (e: any) {
      setDeleteError(e?.response?.data?.message || t("messages.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDelete = (store: StoreApi) => {
    setTarget({ id: store.id, name: store.name });
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button
            onClick={() => router.push(`/${locale}/admin/stores/new`)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("actions.add")}
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-secondary/20 bg-card">
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">
            {t("table.loading")}
          </div>
        ) : stores.length === 0 ? (
          <div className="p-6">
            <p className="text-sm text-muted-foreground">{t("table.empty")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-secondary/20">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">
                    {t("table.name")}
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    {t("table.slug")}
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    {t("table.products")}
                  </th>
                  <th className="text-left p-4 font-medium text-sm">
                    {t("table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-b border-secondary/10 hover:bg-secondary/5"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {store.logo && (
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">{store.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {store.slug}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {store._count.products}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/${locale}/admin/stores/${store.slug}/edit`,
                            )
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleDelete(store)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={closeDelete}
        title={t("modal.deleteTitle")}
        description={
          <>
            {t("modal.deleteDescription", { name: target?.name || "" })}
            {deleteError && (
              <div className="mt-2 text-sm text-destructive">{deleteError}</div>
            )}
          </>
        }
        confirmLabel={t("modal.confirmDelete")}
        cancelLabel={t("actions.cancel")}
        loading={deleteLoading}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

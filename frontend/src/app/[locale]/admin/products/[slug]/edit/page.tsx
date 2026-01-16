"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import type {
  Locale,
  SelectOption,
  ProductApi,
  ProductFormValues,
} from "@/types";
import { ProductForm, ConfirmModal } from "@/components";

type CategoryApi = {
  id: number;
  slug: string;
  translations: { locale: string; name: string }[];
};

export default function AdminEditProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  const t = useTranslations("admin.products");

  const [id, setId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [initialValues, setInitialValues] = useState<ProductFormValues>({
    titleEn: "",
    descEn: "",
    titleKa: "",
    descKa: "",
    slug: "",
    price: "",
    oldPrice: "",
    discount: "",
    stock: "0",
    categoryId: "",
    isFeatured: false,
    images: [""],
  });

  // delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setError("");
      setFieldErrors({});

      // 1) product by slug
      const productRes = await api.get(`/products/slug/${slugParam}`);
      const product = productRes.data as ProductApi;

      setId(product.id);

      const en = product.translations.find((x) => x.locale === "en");
      const ka = product.translations.find((x) => x.locale === "ka");

      setInitialValues({
        titleEn: en?.title ?? "",
        descEn: en?.description ?? "",
        titleKa: ka?.title ?? "",
        descKa: ka?.description ?? "",

        slug: product.slug ?? "",
        price: String(product.price ?? ""),
        oldPrice: product.oldPrice != null ? String(product.oldPrice) : "",
        discount: product.discount != null ? String(product.discount) : "",

        stock: String(product.stock ?? "0"),
        categoryId: String(product.categoryId ?? ""),
        isFeatured: !!product.isFeatured,

        images: product.images?.length ? product.images : [""],
      });

      // 2) categories for dropdown
      setLoadingCats(true);
      const catRes = await api.get(`/categories?locale=${locale}`);
      const data = (catRes.data ?? []) as CategoryApi[];

      const opts: SelectOption[] = data.map((c) => ({
        id: c.id,
        name: c.translations?.[0]?.name ?? c.slug,
      }));

      setCategories(opts);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("errors.loadEdit"));
    } finally {
      setLoadingCats(false);
    }
  };

  useEffect(() => {
    if (!slugParam) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam, locale]);

  const validate = (v: ProductFormValues, cleanImages: string[]) => {
    const next: Record<string, string> = {};

    if (!v.titleEn.trim()) next.titleEn = t("errors.titleEn");
    if (!v.descEn.trim()) next.descEn = t("errors.descEn");
    if (!v.titleKa.trim()) next.titleKa = t("errors.titleKa");
    if (!v.descKa.trim()) next.descKa = t("errors.descKa");
    if (!v.slug.trim()) next.slug = t("errors.slug");

    const p = Number(v.price);
    if (!v.price || Number.isNaN(p) || p <= 0) next.price = t("errors.price");

    const s = Number(v.stock);
    if (v.stock === "" || Number.isNaN(s) || s < 0)
      next.stock = t("errors.stock");

    if (!v.categoryId) next.categoryId = t("errors.category");

    if (cleanImages.length < 1) next.images = t("errors.images");

    if (v.oldPrice) {
      const op = Number(v.oldPrice);
      if (Number.isNaN(op) || op <= 0) next.oldPrice = t("errors.oldPrice");
    }

    if (v.discount) {
      const d = Number(v.discount);
      if (Number.isNaN(d) || d < 0 || d > 100)
        next.discount = t("errors.discount");
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (v: ProductFormValues, cleanImages: string[]) => {
    if (!id) return;
    if (!validate(v, cleanImages)) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        slug: v.slug.trim(),
        price: Number(v.price),
        stock: Number(v.stock),
        categoryId: Number(v.categoryId),
        isFeatured: v.isFeatured,
        images: cleanImages,
        oldPrice: v.oldPrice ? Number(v.oldPrice) : null,
        discount: v.discount ? Number(v.discount) : null,
        translations: [
          {
            locale: "en",
            title: v.titleEn.trim(),
            description: v.descEn.trim(),
          },
          {
            locale: "ka",
            title: v.titleKa.trim(),
            description: v.descKa.trim(),
          },
        ],
      };

      await api.patch(`/products/${id}`, payload);
      router.push(`/${locale}/admin/products`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("errors.saveEdit"));
    } finally {
      setSaving(false);
    }
  };

  const openDelete = () => setDeleteOpen(true);
  const closeDelete = () => {
    if (deleting) return;
    setDeleteOpen(false);
  };

  const confirmDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await api.delete(`/products/${id}`);
      router.push(`/${locale}/admin/products`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("errors.delete"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      {error && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      <ProductForm
        mode="edit"
        title={t("form.editTitle")}
        description={t("form.editDescription")}
        categories={categories}
        loadingCategories={loadingCats}
        initialValues={initialValues}
        submitting={saving}
        errors={fieldErrors}
        onCancel={() => router.push(`/${locale}/admin/products`)}
        onSubmit={handleSubmit}
        labels={{
          contentTitle: t("form.contentTitle"),
          titleEn: t("form.fields.titleEn"),
          descEn: t("form.fields.descEn"),
          titleKa: t("form.fields.titleKa"),
          descKa: t("form.fields.descKa"),
          slug: t("form.fields.slug"),
          price: t("form.fields.price"),
          oldPrice: t("form.fields.oldPrice"),
          discount: t("form.fields.discount"),
          stock: t("form.fields.stock"),
          category: t("form.fields.category"),
          selectCategory: t("form.fields.selectCategory"),
          featured: t("form.fields.featured"),
          featuredHint: t("form.fields.featuredHint"),
          imagesTitle: t("form.fields.imagesTitle"),
          addImage: t("form.fields.addImage"),
          imageUrl: t("form.fields.imageUrl"),
          remove: t("form.fields.remove"),
          cancel: t("actions.cancel"),
          submit: t("form.buttons.submitEdit"),
          submitting: t("form.buttons.submitting"),
        }}
      />

      {/* delete button under form */}
      <div className="max-w-3xl mx-auto px-6 pb-6 flex justify-end">
        <button
          type="button"
          onClick={openDelete}
          className="text-sm text-destructive hover:opacity-80"
          disabled={deleting}
        >
          {deleting ? t("modal.deleting") : t("actions.delete")}
        </button>
      </div>

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={t("modal.deleteDescription", {
          name: initialValues.titleEn || initialValues.slug,
        })}
        cancelLabel={t("actions.cancel")}
        confirmLabel={deleting ? t("modal.deleting") : t("actions.delete")}
      />
    </>
  );
}

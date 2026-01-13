"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Button, Input } from "@/components";
import { ChevronLeft, Trash2 } from "lucide-react";

type Locale = "en" | "ka";

type CategoryApi = {
  id: number;
  slug: string;
  image: string | null;
  parentId: number | null;
  translations: { locale: string; name: string }[];
};

type CategoryOption = {
  id: number;
  parentId: number | null;
  name: string;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildIndentedOptions(list: CategoryOption[]) {
  const byParent = new Map<number | null, CategoryOption[]>();
  for (const c of list) {
    const key = c.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(c);
    byParent.set(key, arr);
  }

  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  const result: { id: number; label: string }[] = [];
  const dfs = (parentId: number | null, depth: number) => {
    const children = byParent.get(parentId) ?? [];
    for (const c of children) {
      const prefix = depth === 0 ? "" : `${"— ".repeat(depth)}`;
      result.push({ id: c.id, label: `${prefix}${c.name}` });
      dfs(c.id, depth + 1);
    }
  };

  dfs(null, 0);
  return result;
}

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  const [id, setId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string>("");

  // tabs
  const [activeLang, setActiveLang] = useState<Locale>("en");

  // form
  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");

  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [image, setImage] = useState("");
  const [parentId, setParentId] = useState<string>(""); // "" => root
  const [originalParentId, setOriginalParentId] = useState<number | null>(null);

  // categories for parent select
  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // auto slug from EN name (if not touched)
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn));
  }, [nameEn, slugTouched]);

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      // ✅ 1) fetch by slug (gives us id + all translations)
      const catRes = await api.get(`/categories/slug/${slugParam}`);
      const cat = catRes.data as CategoryApi;

      setId(cat.id);

      const en = cat.translations.find((t) => t.locale === "en")?.name ?? "";
      const ka = cat.translations.find((t) => t.locale === "ka")?.name ?? "";

      setNameEn(en);
      setNameKa(ka);

      // keep existing slug as initial value (don’t auto override)
      setSlug(cat.slug ?? "");
      setSlugTouched(true);

      setImage(cat.image ?? "");
      setParentId(cat.parentId ? String(cat.parentId) : "");
      setOriginalParentId(cat.parentId ?? null);

      // ✅ 2) fetch categories list (localized names for dropdown)
      setLoadingCats(true);
      const listRes = await api.get(`/categories?locale=${locale}`);
      const list = (listRes.data ?? []) as CategoryApi[];

      const normalized: CategoryOption[] = list.map((c) => ({
        id: c.id,
        parentId: c.parentId ?? null,
        name: c.translations?.[0]?.name ?? c.slug,
      }));

      setCats(normalized);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load category.");
    } finally {
      setLoadingCats(false);
      setLoading(false);
    }
  };

  // ✅ load when slug changes / locale changes
  useEffect(() => {
    if (!slugParam) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugParam, locale]);

  const parentOptions = useMemo(() => {
    // remove current category from parent list (cannot be parent of itself)
    const filtered = cats.filter((c) => c.id !== id);
    return buildIndentedOptions(filtered);
  }, [cats, id]);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!nameEn.trim()) next.nameEn = "English name is required";
    if (!nameKa.trim()) next.nameKa = "Georgian name is required";
    if (!slug.trim()) next.slug = "Slug is required";

    if (id && parentId && Number(parentId) === id)
      next.parentId = "Invalid parent";

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!validate()) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        slug: slug.trim(),
        image: image.trim() || null,
        parentId: parentId ? Number(parentId) : null,
        translations: [
          { locale: "en", name: nameEn.trim() },
          { locale: "ka", name: nameKa.trim() },
        ],
      };

      await api.patch(`/categories/${id}`, payload);

      // ✅ თუ slug შეცვლი, edit route სხვანაირია — სჯობს list-ზე გადავიდეს
      router.push(`/${locale}/admin/categories`);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!id) return;

    const ok = confirm(
      "Delete this category?\n\nIf it has subcategories/products, deletion may fail."
    );
    if (!ok) return;

    try {
      setDeleting(true);
      await api.delete(`/categories/${id}`);
      router.push(`/${locale}/admin/categories`);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Delete failed.");
    } finally {
      setDeleting(false);
    }
  };

  const LangTabs = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setActiveLang("en")}
        className={[
          "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border transition-colors",
          activeLang === "en"
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
        ].join(" ")}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setActiveLang("ka")}
        className={[
          "inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium border transition-colors",
          activeLang === "ka"
            ? "bg-primary/10 text-primary border-primary/20"
            : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground",
        ].join(" ")}
      >
        KA
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Edit Category</h1>
          <p className="text-sm text-muted-foreground">
            Update translations, parent, slug and image.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="secondary">
            <Link href={`/${locale}/admin/categories`}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>

          <Button
            variant="text"
            className="text-destructive"
            onClick={onDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="space-y-5">
        <div className="rounded-2xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Name</h2>
            {LangTabs}
          </div>

          {activeLang === "en" ? (
            <>
              <Input
                label="Name (EN)"
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                fullWidth
                required
              />
              {fieldErrors.nameEn && (
                <p className="-mt-2 text-sm text-destructive">
                  {fieldErrors.nameEn}
                </p>
              )}
            </>
          ) : (
            <>
              <Input
                label="Name (KA)"
                type="text"
                value={nameKa}
                onChange={(e) => setNameKa(e.target.value)}
                fullWidth
                required
              />
              {fieldErrors.nameKa && (
                <p className="-mt-2 text-sm text-destructive">
                  {fieldErrors.nameKa}
                </p>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Slug"
              type="text"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              fullWidth
              required
            />
            {fieldErrors.slug && (
              <p className="mt-2 text-sm text-destructive">
                {fieldErrors.slug}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">
              Parent Category (optional)
            </label>
            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              disabled={loadingCats}
            >
              <option value="">
                {loadingCats ? "Loading..." : "— No parent (root) —"}
              </option>

              {parentOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </option>
              ))}
            </select>

            {fieldErrors.parentId && (
              <p className="mt-2 text-sm text-destructive">
                {fieldErrors.parentId}
              </p>
            )}

            {originalParentId !== null && (
              <p className="mt-2 text-xs text-muted-foreground">
                Changing parent will move this category in the tree.
              </p>
            )}
          </div>
        </div>

        <Input
          label="Image URL (optional)"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/${locale}/admin/categories`)}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" disabled={saving || !id}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}

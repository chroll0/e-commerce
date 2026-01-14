"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Button } from "@/components";
import { api } from "@/lib/axios";

type Locale = "en" | "ka";

type CategoryApi = {
  id: number;
  parentId: number | null;
  slug: string;
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
  // build tree
  const byParent = new Map<number | null, CategoryOption[]>();
  for (const c of list) {
    const key = c.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(c);
    byParent.set(key, arr);
  }
  // sort
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

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;

  const [activeLang, setActiveLang] = useState<Locale>("en");

  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get("parentId");
  const [parentId, setParentId] = useState<string>("");

  const [nameEn, setNameEn] = useState("");
  const [nameKa, setNameKa] = useState("");

  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [image, setImage] = useState("");

  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!parentIdParam) return;
    const parsed = Number(parentIdParam);
    if (!Number.isFinite(parsed)) return;

    setParentId(String(parsed));
  }, [parentIdParam]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn));
  }, [nameEn, slugTouched]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        const res = await api.get(`/categories?locale=${locale}`);
        if (!mounted) return;

        const data = (res.data ?? []) as CategoryApi[];
        const normalized: CategoryOption[] = data.map((c) => ({
          id: c.id,
          parentId: c.parentId ?? null,
          name: c.translations?.[0]?.name ?? c.slug,
        }));

        setCats(normalized);
      } catch {
        if (!mounted) return;
        setCats([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [locale]);

  const parentOptions = useMemo(() => buildIndentedOptions(cats), [cats]);

  const validate = () => {
    const next: Record<string, string> = {};

    if (!nameEn.trim()) next.nameEn = "English name is required";
    if (!nameKa.trim()) next.nameKa = "Georgian name is required";
    if (!slug.trim()) next.slug = "Slug is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        slug: slug.trim() || undefined,
        image: image.trim() || undefined,
        parentId: parentId ? Number(parentId) : undefined, // root if undefined
        translations: [
          { locale: "en", name: nameEn.trim() },
          { locale: "ka", name: nameKa.trim() },
        ],
      };

      await api.post("/categories", payload);

      router.push(`/${locale}/admin/categories`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to create category. Please try again.";
      setErrors((p) => ({ ...p, form: msg }));
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Create Category</h1>
          <p className="text-sm text-muted-foreground">
            Add a category and optionally place it under a parent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {LangTabs}
          <Button
            variant="text"
            onClick={() => router.push(`/${locale}/admin/categories`)}
            className="text-muted"
          >
            Back
          </Button>
        </div>
      </div>

      {errors.form && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* name translations */}
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
                placeholder="Electronics"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                fullWidth
                required
              />
              {errors.nameEn && (
                <p className="-mt-2 text-sm text-destructive">
                  {errors.nameEn}
                </p>
              )}
            </>
          ) : (
            <>
              <Input
                label="Name (KA)"
                type="text"
                placeholder="ტექნიკა"
                value={nameKa}
                onChange={(e) => setNameKa(e.target.value)}
                fullWidth
                required
              />
              {errors.nameKa && (
                <p className="-mt-2 text-sm text-destructive">
                  {errors.nameKa}
                </p>
              )}
            </>
          )}
        </div>

        {/* slug + parent + image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Slug"
              type="text"
              placeholder="electronics"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              fullWidth
              required
            />
            {errors.slug && (
              <p className="mt-2 text-sm text-destructive">{errors.slug}</p>
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

            <p className="mt-2 text-xs text-muted-foreground">
              Example: Electronics → Computer Parts → GPUs
            </p>
          </div>
        </div>

        <Input
          label="Image URL (optional)"
          type="text"
          placeholder="https://..."
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

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Create category"}
          </Button>
        </div>
      </form>
    </div>
  );
}

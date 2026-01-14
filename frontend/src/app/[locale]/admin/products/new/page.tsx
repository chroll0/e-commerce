"use client";

import { useEffect, useMemo, useState } from "react";
import { Locale, useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Input, Button, Tooltip } from "@/components";
import { api } from "@/lib/axios";
import { Info } from "lucide-react";

type CategoryApi = {
  id: number;
  slug: string;
  translations: { locale: string; name: string }[];
};

type CategoryOption = { id: number; name: string };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminCreateProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.products");

  // language tab
  const [activeLang, setActiveLang] = useState<Locale>("en");

  // translations state (EN/KA)
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [titleKa, setTitleKa] = useState("");
  const [descKa, setDescKa] = useState("");

  // slug (generated from EN title by default)
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  // other fields
  const [price, setPrice] = useState<string>("");
  const [oldPrice, setOldPrice] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");

  const [stock, setStock] = useState<string>("0");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState(false);

  const [images, setImages] = useState<string[]>([""]);

  // UI state
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(titleEn));
  }, [titleEn, slugTouched]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCats(true);
        const res = await api.get(`/categories?locale=${locale}`);
        if (!mounted) return;

        const data = (res.data ?? []) as CategoryApi[];
        const opts: CategoryOption[] = data.map((c) => ({
          id: c.id,
          name: c.translations?.[0]?.name ?? c.slug,
        }));
        setCategories(opts);
      } catch {
        if (!mounted) return;
        setCategories([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [locale]);

  const cleanImages = useMemo(
    () => images.map((x) => x.trim()).filter(Boolean),
    [images]
  );

  const validate = () => {
    const next: Record<string, string> = {};

    if (!titleEn.trim()) next.titleEn = "English title is required";
    if (!descEn.trim()) next.descEn = "English description is required";
    if (!titleKa.trim()) next.titleKa = "Georgian title is required";
    if (!descKa.trim()) next.descKa = "Georgian description is required";
    if (!slug.trim()) next.slug = "Slug is required";

    const p = Number(price);
    if (!price || Number.isNaN(p) || p <= 0) next.price = "Price must be > 0";

    const s = Number(stock);
    if (stock === "" || Number.isNaN(s) || s < 0)
      next.stock = "Stock must be ≥ 0";

    if (!categoryId) next.categoryId = "Category is required";

    if (cleanImages.length < 1)
      next.images = "At least 1 image URL is required";

    if (oldPrice) {
      const op = Number(oldPrice);
      if (Number.isNaN(op) || op <= 0) next.oldPrice = "Old price must be > 0";
    }

    if (discount) {
      const d = Number(discount);
      if (Number.isNaN(d) || d < 0 || d > 100)
        next.discount = "Discount must be 0–100";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const updateImage = (idx: number, value: string) => {
    setImages((prev) => prev.map((v, i) => (i === idx ? value : v)));
  };

  const addImageField = () => setImages((prev) => [...prev, ""]);
  const removeImageField = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = {
        slug: slug.trim() || undefined,
        price: Number(price),
        stock: Number(stock),
        categoryId: Number(categoryId),
        isFeatured,
        images: cleanImages,
        ...(oldPrice ? { oldPrice: Number(oldPrice) } : {}),
        ...(discount ? { discount: Number(discount) } : {}),
        translations: [
          { locale: "en", title: titleEn.trim(), description: descEn.trim() },
          { locale: "ka", title: titleKa.trim(), description: descKa.trim() },
        ],
      };

      await api.post("/products", payload);

      router.push(`/${locale}/admin/products`);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to create product. Please try again.";
      setErrors((prev) => ({ ...prev, form: msg }));
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
          <h1 className="text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex items-center gap-2">{LangTabs}</div>
      </div>

      {errors.form && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        {/* i18n fields */}
        <div className="rounded-2xl border border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Content</h2>
            {LangTabs}
          </div>

          {activeLang === "en" ? (
            <>
              <Input
                label="Title (EN)"
                type="text"
                placeholder="English product title"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                fullWidth
                required
              />
              {errors.titleEn && (
                <p className="-mt-2 text-sm text-destructive">
                  {errors.titleEn}
                </p>
              )}

              <div>
                <label className="text-sm font-medium">Description (EN)</label>
                <textarea
                  className="mt-2 w-full min-h-[140px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  placeholder="English description..."
                  value={descEn}
                  onChange={(e) => setDescEn(e.target.value)}
                />
                {errors.descEn && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.descEn}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <Input
                label="Title (KA)"
                type="text"
                placeholder="ქართული სათაური"
                value={titleKa}
                onChange={(e) => setTitleKa(e.target.value)}
                fullWidth
                required
              />
              {errors.titleKa && (
                <p className="-mt-2 text-sm text-destructive">
                  {errors.titleKa}
                </p>
              )}

              <div>
                <label className="text-sm font-medium">Description (KA)</label>
                <textarea
                  className="mt-2 w-full min-h-[140px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  placeholder="ქართული აღწერა..."
                  value={descKa}
                  onChange={(e) => setDescKa(e.target.value)}
                />
                {errors.descKa && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.descKa}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Slug"
            type="text"
            placeholder="product-title"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            fullWidth
            required
          />
          {errors.slug && (
            <p className="-mt-2 text-sm text-destructive">{errors.slug}</p>
          )}
        </div>

        {/* numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Price"
            type="number"
            placeholder="99.99"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            required
          />
          <Input
            label="Old price (optional)"
            type="number"
            placeholder="129.99"
            value={oldPrice}
            onChange={(e) => setOldPrice(e.target.value)}
            fullWidth
          />
          <Input
            label="Discount % (optional)"
            type="number"
            placeholder="10"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            fullWidth
          />
          {(errors.price || errors.oldPrice || errors.discount) && (
            <div className="md:col-span-3 space-y-1">
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
              {errors.oldPrice && (
                <p className="text-sm text-destructive">{errors.oldPrice}</p>
              )}
              {errors.discount && (
                <p className="text-sm text-destructive">{errors.discount}</p>
              )}
            </div>
          )}
        </div>

        {/* stock/category/featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <Input
            label="Stock"
            type="number"
            placeholder="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            fullWidth
            required
          />

          <div className="w-full">
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCats}
              required
            >
              <option value="">
                {loadingCats ? "Loading..." : "Select category"}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-2 text-sm text-destructive">
                {errors.categoryId}
              </p>
            )}
          </div>

          <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
            <span className="text-sm">Featured</span>
            <Tooltip
              side="top"
              className="w-60 max-w-none"
              content="Show this product in Featured sections."
            >
              <Info className="h-4 w-4 hover:text-foreground" />
            </Tooltip>
          </label>

          {errors.stock && (
            <p className="md:col-span-3 -mt-2 text-sm text-destructive">
              {errors.stock}
            </p>
          )}
        </div>

        {/* images */}
        <div className="rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-base font-semibold">Images (URLs)</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addImageField}
            >
              Add image
            </Button>
          </div>

          {errors.images && (
            <p className="mt-2 text-sm text-destructive">{errors.images}</p>
          )}

          <div className="mt-4 space-y-3">
            {images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    label={idx === 0 ? "Image URL" : (undefined as any)}
                    type="text"
                    placeholder="https://..."
                    value={img}
                    onChange={(e) => updateImage(idx, e.target.value)}
                    fullWidth
                    required={idx === 0}
                  />
                </div>

                {images.length > 1 && (
                  <Button
                    type="button"
                    variant="text"
                    className="text-destructive"
                    onClick={() => removeImageField(idx)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push(`/${locale}/admin/products`)}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? "Saving..." : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

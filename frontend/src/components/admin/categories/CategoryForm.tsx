"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Input, Button } from "@/components";
import { FormProps } from "@/types";
import { buildIndentedOptions, slugify } from "./formOptions";

const CategoryForm: FC<FormProps> = ({
  mode,
  loadingParents = false,
  parentOptions,
  excludeParentId = null,
  initialValues,
  submitting = false,
  onCancel,
  onSubmit,
  title,
  description,
  cancelLabel,
  submitLabel,
  submittingLabel,
  parentLabel,
  noParentLabel,
  loadingLabel,
  nameCardTitle,
  nameEnLabel,
  nameKaLabel,
  slugLabel,
  imageLabel,
  parentHint,
  errors = {},
}) => {
  const [nameEn, setNameEn] = useState(initialValues.nameEn);
  const [nameKa, setNameKa] = useState(initialValues.nameKa);

  const [slug, setSlug] = useState(initialValues.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const [image, setImage] = useState(initialValues.image);
  const [parentId, setParentId] = useState(initialValues.parentId);

  useEffect(() => {
    setNameEn(initialValues.nameEn);
    setNameKa(initialValues.nameKa);
    setSlug(initialValues.slug);
    setImage(initialValues.image);
    setParentId(initialValues.parentId);
    setSlugTouched(mode === "edit");
  }, [initialValues, mode]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn));
  }, [nameEn, slugTouched]);

  const selectOptions = useMemo(() => {
    const filtered =
      excludeParentId == null
        ? parentOptions
        : parentOptions.filter((c) => c.id !== excludeParentId);

    return buildIndentedOptions(filtered);
  }, [parentOptions, excludeParentId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      nameEn,
      nameKa,
      slug,
      image,
      parentId,
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {errors.form && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* name translations */}
        <div className="rounded-2xl border border-border p-4 space-y-4">
          <h2 className="text-base font-semibold">{nameCardTitle}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label={nameEnLabel}
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                fullWidth
                required
              />
              {errors.nameEn && (
                <p className="mt-2 text-sm text-destructive">{errors.nameEn}</p>
              )}
            </div>

            <div>
              <Input
                label={nameKaLabel}
                type="text"
                value={nameKa}
                onChange={(e) => setNameKa(e.target.value)}
                fullWidth
                required
              />
              {errors.nameKa && (
                <p className="mt-2 text-sm text-destructive">{errors.nameKa}</p>
              )}
            </div>
          </div>
        </div>

        {/* slug + parent */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={slugLabel}
              type="text"
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
            <label className="text-sm font-medium">{parentLabel}</label>
            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              disabled={loadingParents}
            >
              <option value="">
                {loadingParents ? loadingLabel : noParentLabel}
              </option>

              {selectOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </option>
              ))}
            </select>

            {errors.parentId && (
              <p className="mt-2 text-sm text-destructive">{errors.parentId}</p>
            )}

            {parentHint && (
              <p className="mt-2 text-xs text-muted-foreground">{parentHint}</p>
            )}
          </div>
        </div>

        <Input
          label={imageLabel}
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          fullWidth
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;

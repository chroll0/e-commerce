"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import {
  Button,
  AdminPageHeader,
  FormInput,
  ImageUpload,
  slugify,
} from "@/components";
import { uploadImage } from "@/lib/cloudinary";
import { makeStoreSchema } from "@/hooks";

type FormValues = {
  name: string;
  slug: string;
  logo: string;
  banner: string;
};

type StoreFormProps = {
  mode: "create" | "edit";
  initialValues: FormValues;
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  title: string;
  description: string;
  cancelLabel: string;
  submitLabel: string;
  submittingLabel: string;
  deleteLabel?: string;
  errors?: Record<string, string>;
};

const StoreForm: FC<StoreFormProps> = ({
  mode,
  initialValues,
  submitting = false,
  onCancel,
  onSubmit,
  onDelete,
  title,
  description,
  cancelLabel,
  submitLabel,
  submittingLabel,
  deleteLabel,
  errors = {},
}) => {
  const t = useTranslations("admin.stores");
  const schema = useMemo(() => makeStoreSchema(t), [t]);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    clearErrors,

    formState: { errors: rhfErrors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),

    defaultValues: {
      name: initialValues.name ?? "",
      slug: initialValues.slug ?? "",
      logo: initialValues.logo ?? "",
      banner: initialValues.banner ?? "",
    },

    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    reset({
      name: initialValues.name ?? "",
      slug: initialValues.slug ?? "",
      logo: initialValues.logo ?? "",
      banner: initialValues.banner ?? "",
    });

    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  const name = watch("name") ?? "";
  const logo = watch("logo") ?? "";
  const banner = watch("banner") ?? "";

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(name), {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });

      clearErrors("slug");
    }
  }, [name, slugTouched, setValue, clearErrors]);

  const submit: SubmitHandler<FormValues> = async (values) => {
    const ok = await trigger("slug");

    if (!ok) return;

    onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      logo: values.logo.trim(),
      banner: values.banner.trim(),
    });
  };

  return (
    <>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          mode === "edit" && onDelete ? (
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              className="inline-flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />

              {deleteLabel || t("actions.delete")}
            </Button>
          ) : undefined
        }
      />

      {errors.form ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="space-y-6 rounded-2xl border border-border p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput<FormValues>
            name="name"
            label={t("form.fields.name")}
            size="lg"
            type="text"
            fullWidth
            control={control}
          />

          <FormInput<FormValues>
            name="slug"
            label={t("form.fields.slug")}
            size="lg"
            type="text"
            fullWidth
            control={control}
            onChange={() => {
              setSlugTouched(true);

              if (rhfErrors.slug) {
                clearErrors("slug");
              }
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ImageUpload
            value={logo}
            onChange={(next: string) =>
              setValue("logo", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            upload={(file) => uploadImage(file, "stores/logos")}
            maxFiles={1}
            maxSizeMb={10}
            error={
              rhfErrors.logo?.message
                ? String(rhfErrors.logo.message)
                : undefined
            }
            labels={{
              title: t("form.fields.logo"),
              hint: t("form.fields.hint"),
              add: t("fields.addLogo"),
              remove: t("fields.remove"),
              preview: t("fields.preview"),
              uploading: (count) => t("fields.uploading", { count }),
              invalidFile: t("fields.invalidFile"),
              tooLarge: (maxMb) => t("fields.tooLarge", { max: maxMb }),
              tooMany: (maxFiles) => t("fields.tooMany", { max: maxFiles }),
              uploadFailed: t("fields.uploadFailed"),
            }}
          />

          <ImageUpload
            value={banner}
            onChange={(next: string) =>
              setValue("banner", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            upload={(file) => uploadImage(file, "stores/banners")}
            maxFiles={1}
            maxSizeMb={10}
            error={
              rhfErrors.banner?.message
                ? String(rhfErrors.banner.message)
                : undefined
            }
            labels={{
              title: t("fields.bannerTitle"),
              hint: t("fields.bannerHint"),

              add: t("fields.addBanner"),
              remove: t("fields.remove"),
              preview: t("fields.preview"),

              uploading: (count) => t("fields.uploading", { count }),

              invalidFile: t("fields.invalidFile"),

              tooLarge: (maxMb) => t("fields.tooLarge", { max: maxMb }),

              tooMany: (maxFiles) => t("fields.tooMany", { max: maxFiles }),

              uploadFailed: t("fields.uploadFailed"),
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </>
  );
};

export default StoreForm;

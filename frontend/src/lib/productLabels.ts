import { ProductLabels } from "@/types/product";

export const buildProductLabels = (
  t: (key: string, vars?: any) => string,
): ProductLabels => ({
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
  imagesHint: t("form.fields.imagesHint"),
  remove: t("form.fields.remove"),

  preview: t("form.fields.preview"),
  uploading: (count: number) => t("form.fields.uploading", { count }),
  invalidFile: t("form.fields.invalidFile"),
  tooLarge: (maxMb: number) => t("form.fields.tooLarge", { max: maxMb }),
  tooMany: (maxFiles: number) => t("form.fields.tooMany", { max: maxFiles }),
  uploadFailed: t("form.fields.uploadFailed"),

  cancel: t("actions.cancel"),
  submit: t("actions.save"),
  submitting: t("form.saving"),
});

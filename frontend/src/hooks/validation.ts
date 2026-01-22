import * as yup from "yup";

type TFn = (key: string, values?: Record<string, any>) => string;

export const makeCategorySchema = (t: TFn) =>
  yup.object({
    nameEn: yup.string().trim().required(t("validation.nameEnRequired")),
    nameKa: yup.string().trim().required(t("validation.nameKaRequired")),
    slug: yup.string().trim().required(t("validation.slugRequired")),
    image: yup.string().trim().default(""),
    parentId: yup.string().default(""),
  });

export const makeProductSchema = (t: TFn) =>
  yup.object({
    titleEn: yup.string().trim().required(t("errors.titleEn")),
    descEn: yup.string().trim().required(t("errors.descEn")),
    titleKa: yup.string().trim().required(t("errors.titleKa")),
    descKa: yup.string().trim().required(t("errors.descKa")),
    slug: yup.string().trim().required(t("errors.slug")),

    price: yup
      .string()
      .required(t("errors.price"))
      .test("price", t("errors.price"), (v) => {
        const n = Number(v);
        return !!v && !Number.isNaN(n) && n > 0;
      }),

    oldPrice: yup
      .string()
      .default("")
      .test("oldPrice", t("errors.oldPrice"), (v) => {
        if (!v) return true;
        const n = Number(v);
        return !Number.isNaN(n) && n > 0;
      }),

    discount: yup
      .string()
      .default("")
      .test("discount", t("errors.discount"), (v) => {
        if (!v) return true;
        const n = Number(v);
        return !Number.isNaN(n) && n >= 0 && n <= 100;
      }),

    stock: yup
      .string()
      .required(t("errors.stock"))
      .test("stock", t("errors.stock"), (v) => {
        const n = Number(v);
        return v !== "" && !Number.isNaN(n) && n >= 0;
      }),

    categoryId: yup.string().required(t("errors.category")),

    isFeatured: yup.boolean().default(false),

    images: yup
      .array()
      .of(yup.string().trim().default("").defined())
      .transform((value) => (Array.isArray(value) ? value : []))
      .test("images-required", t("errors.images"), (arr) => {
        const cleaned = (arr ?? []).map((x) => x.trim()).filter(Boolean);
        return cleaned.length >= 1;
      })
      .default([])
      .defined(),
  });

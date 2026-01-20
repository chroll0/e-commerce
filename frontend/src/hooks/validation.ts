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

import { StoreOption } from "./store";

export type ProductTranslation = {
  name?: string;
  locale: "en" | "ka";
  title: string;
  description: string;
};

export type ProductFormValues = {
  titleEn: string;
  descEn: string;
  titleKa: string;
  descKa: string;

  slug: string;

  price: string;
  oldPrice: string;
  discount: string;

  stock: string;

  categoryId: string;
  storeId: string;

  isFeatured: boolean;

  images: string[];
};

export type ProductCategoryOption = {
  id: number;
  parentId: number | null;
  translations: { locale: "en" | "ka"; name: string }[];
  name?: string;
  slug?: string;
  image?: string | null;
};

export type ProductApi = {
  id: number;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  stock: number;
  category?: {
    id: number;
    translations: ProductTranslation[];
  };
  categoryId: number;
  storeId?: number | null;
  isFeatured: boolean;
  images: string[];
  translations: ProductTranslation[];
};

export type ProductLabels = {
  contentTitle: string;

  titleEn: string;
  descEn: string;
  titleKa: string;
  descKa: string;

  slug: string;

  price: string;
  oldPrice: string;
  discount: string;

  stock: string;
  category: string;
  selectCategory: string;
  selectedStore: string;
  selectStore: string;

  featured: string;
  featuredHint: string;

  imagesTitle: string;
  addImage: string;
  imagesHint: string;
  remove: string;

  preview: string;
  uploading: (count: number) => string;
  invalidFile: string;
  tooLarge: (maxMb: number) => string;
  tooMany: (maxFiles: number) => string;
  uploadFailed: string;

  cancel: string;
  submit: string;
  submitting: string;
};

export type ProductProps = {
  mode: "create" | "edit";
  title: string;
  description: string;

  categories: ProductCategoryOption[];
  loadingCategories?: boolean;

  stores: StoreOption[];
  loadingStores?: boolean;

  initialValues: ProductFormValues;
  submitting?: boolean;
  errors?: Record<string, string>;

  onCancel: () => void;
  onSubmit: (values: ProductFormValues, cleanImages: string[]) => void;

  labels: ProductLabels;
};

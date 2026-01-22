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
  isFeatured: boolean;

  images: string[];
};

export type CategoryOption = { id: number; name: string };

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
  isFeatured: boolean;
  images: string[];
  translations: ProductTranslation[];
};
type Labels = {
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
  featured: string;
  featuredHint: string;

  imagesTitle: string;
  addImage: string;
  imagesHint: string;
  remove: string;

  cancel: string;
  submit: string;
  submitting: string;
};

export type ProductProps = {
  mode: "create" | "edit";
  title: string;
  description: string;

  categories: CategoryOption[];
  loadingCategories?: boolean;

  initialValues: ProductFormValues;
  submitting?: boolean;
  errors?: Record<string, string>;

  onCancel: () => void;
  onSubmit: (values: ProductFormValues, cleanImages: string[]) => void;
  labels: Labels;
};

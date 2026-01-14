export type Locale = "en" | "ka";

export type CategoryOption = {
  id: number;
  parentId: number | null;
  name: string;
};

export type CategoryFormValues = {
  nameEn: string;
  nameKa: string;
  slug: string;
  image: string;
  parentId: string;
};

export type Props = {
  mode: "create" | "edit";
  locale: Locale;
  loadingParents?: boolean;
  parentOptions: CategoryOption[];
  excludeParentId?: number | null;
  initialValues: CategoryFormValues;
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (values: CategoryFormValues) => void;
  title: string;
  description: string;
  backLabel?: string;
  cancelLabel: string;
  submitLabel: string;
  submittingLabel: string;
  parentLabel: string;
  noParentLabel: string;
  loadingLabel: string;
  nameCardTitle: string;
  nameEnLabel: string;
  nameKaLabel: string;
  slugLabel: string;
  imageLabel: string;
  parentHint?: string;
  errors?: Partial<
    Record<keyof CategoryFormValues | "form" | "nameEn" | "nameKa", string>
  >;
};

export type CategoryApi = {
  id: number;
  slug: string;
  parentId: number | null;
  translations: { locale: string; name: string }[];
  image?: string;
  createdAt?: string;
};

export type CategoryNode = {
  id: number;
  slug: string;
  parentId: number | null;
  name: string;
  children: CategoryNode[];
};

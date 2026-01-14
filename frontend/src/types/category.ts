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

export type FormProps = {
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

export type HeaderProps = {
  locale: "en" | "ka";
  onExpandAll: () => void;
  onCollapseAll: () => void;
  title: string;
  description: string;
  expandAllLabel: string;
  collapseAllLabel: string;
  addLabel: string;
};

export type CategoryRow = {
  node: CategoryNode;
  depth: number;
  hasChildren: boolean;
  isLast: boolean;
  ancestorLast: boolean[];
};

type Row = { node: CategoryNode; depth: number; hasChildren: boolean };

type Labels = {
  name: string;
  slug: string;
  actions: string;
  loading: string;
  empty: string;
  addSub: string;
  edit: string;
  delete: string;
};

export type TableProps = {
  locale: "en" | "ka";
  loading: boolean;
  rows: CategoryRow[];
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onRequestDelete: (payload: { id: number; name: string }) => void;
  labels: Labels;
};

import { Locale } from "./common";

export type CategoryOption = {
  id: number;
  parentId: number | null;
  name: string;
};

export type CategoryApi = {
  id: number;
  slug: string;
  parentId: number | null;

  translations: {
    locale: string;
    name: string;
  }[];

  image?: string | null;
  createdAt?: string;
  updatedAt?: string;

  _count?: {
    products: number;
  };
};

export type CategoryFormValues = {
  nameEn: string;
  nameKa: string;
  slug: string;
  image: string;
  parentId: string;
};

export type CategoryProps = {
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
  parentHint?: string;
  errors?: Partial<
    Record<keyof CategoryFormValues | "form" | "nameEn" | "nameKa", string>
  >;
};

export type CategoryNode = {
  id: number;
  slug: string;
  parentId: number | null;
  name: string;
  children: CategoryNode[];
  products: number;
  productsTotal: number;
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
  products: string;
  actions: string;
  loading: string;
  empty: string;
  addSub: string;
  edit: string;
  delete: string;
  expandAll?: string;
  collapseAll?: string;
};

export type TableProps = {
  locale: Locale;
  loading: boolean;
  rows: CategoryRow[];
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onRequestDelete: (payload: { id: number; name: string }) => void;
  labels: Labels;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  isExpandedAll: boolean;
};

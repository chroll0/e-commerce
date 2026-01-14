import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components";
import type { CategoryNode } from "./categoryTree";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

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

type Props = {
  locale: "en" | "ka";
  loading: boolean;
  rows: Row[];
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onRequestDelete: (payload: { id: number; name: string }) => void;
  labels: Labels;
};

const CategoriesTable: FC<Props> = ({
  locale,
  loading,
  rows,
  expanded,
  onToggle,
  onRequestDelete,
  labels,
}) => {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground">
        <div className="col-span-5">{labels.name}</div>
        <div className="col-span-4">{labels.slug}</div>
        <div className="col-span-3">{labels.actions}</div>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          {labels.loading}
        </div>
      ) : rows.length === 0 ? (
        <div className="px-4 py-8 text-sm text-muted-foreground">
          {labels.empty}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {rows.map(({ node, depth, hasChildren }) => {
            const isOpen = expanded.has(node.id);

            return (
              <div
                key={node.id}
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-muted/40 transition"
              >
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <div style={{ width: depth * 18 }} />

                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={() => onToggle(node.id)}
                      className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-muted"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <div className="h-8 w-8" />
                  )}

                  <span className="text-sm truncate font-medium text-foreground">
                    {node.name}
                  </span>

                  {hasChildren && (
                    <span className="text-xs text-muted-foreground">
                      ({node.children.length})
                    </span>
                  )}
                </div>

                <div className="col-span-4 flex items-center text-sm text-muted-foreground truncate">
                  {node.slug}
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Button asChild variant="secondary" size="xs">
                    <Link
                      href={`/${locale}/admin/categories/new?parentId=${node.id}`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {labels.addSub}
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="xs">
                    <Link
                      href={`/${locale}/admin/categories/${node.slug}/edit`}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      {labels.edit}
                    </Link>
                  </Button>

                  <Button
                    variant="tertiary"
                    size="xs"
                    className="text-destructive"
                    onClick={() =>
                      onRequestDelete({ id: node.id, name: node.name })
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {labels.delete}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;

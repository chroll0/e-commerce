// components/categories/CategoriesTable.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { FC } from "react";
import type { CategoryNode } from "./categoryTree";

type Row = { node: CategoryNode; depth: number; hasChildren: boolean };

type Props = {
  locale: "en" | "ka";
  loading: boolean;
  rows: Row[];
  expanded: Set<number>;
  onToggle: (id: number) => void;
  onRequestDelete: (payload: { id: number; name: string }) => void;
};

const CategoriesTable: FC<Props> = ({
  locale,
  loading,
  rows,
  expanded,
  onToggle,
  onRequestDelete,
}) => {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
      <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border text-xs font-medium text-muted-foreground">
        <div className="col-span-6">Name</div>
        <div className="col-span-3">Slug</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-sm text-muted-foreground">
          Loading...
        </div>
      ) : rows.length === 0 ? (
        <div className="px-4 py-8 text-sm text-muted-foreground">
          No categories yet. Create your first category.
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
                <div className="col-span-6 flex items-center gap-2 min-w-0">
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

                  <span className="truncate font-medium text-foreground">
                    {node.name}
                  </span>

                  {hasChildren && (
                    <span className="text-xs text-muted-foreground">
                      ({node.children.length})
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex items-center text-sm text-muted-foreground truncate">
                  {node.slug}
                </div>

                <div className="col-span-3 flex items-center justify-end gap-2">
                  <Button asChild variant="secondary" size="sm">
                    <Link
                      href={`/${locale}/admin/categories/new?parentId=${node.id}`}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Sub
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="sm">
                    <Link
                      href={`/${locale}/admin/categories/${node.slug}/edit`}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>

                  <Button
                    variant="text"
                    size="sm"
                    className="text-destructive"
                    onClick={() =>
                      onRequestDelete({ id: node.id, name: node.name })
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { api } from "@/lib/axios";
import { Button } from "@/components";
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";

type Locale = "en" | "ka";

type CategoryApi = {
  id: number;
  slug: string;
  parentId: number | null;
  translations: { locale: string; name: string }[];
  createdAt?: string;
};

type CategoryNode = {
  id: number;
  slug: string;
  parentId: number | null;
  name: string;
  children: CategoryNode[];
};

function buildTree(categories: CategoryApi[]) {
  const nodes = new Map<number, CategoryNode>();

  for (const c of categories) {
    nodes.set(c.id, {
      id: c.id,
      slug: c.slug,
      parentId: c.parentId ?? null,
      name: c.translations?.[0]?.name ?? c.slug,
      children: [],
    });
  }

  const roots: CategoryNode[] = [];

  for (const node of nodes.values()) {
    if (node.parentId && nodes.has(node.parentId)) {
      nodes.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (arr: CategoryNode[]) => {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    arr.forEach((x) => sortRec(x.children));
  };
  sortRec(roots);

  return roots;
}

function flattenTree(roots: CategoryNode[], expanded: Set<number>, depth = 0) {
  const rows: { node: CategoryNode; depth: number; hasChildren: boolean }[] =
    [];
  for (const node of roots) {
    const hasChildren = node.children.length > 0;
    rows.push({ node, depth, hasChildren });

    if (hasChildren && expanded.has(node.id)) {
      rows.push(...flattenTree(node.children, expanded, depth + 1));
    }
  }
  return rows;
}

export default function AdminCategoriesPage() {
  const locale = useLocale() as Locale;

  const [items, setItems] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // expanded nodes
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/categories?locale=${locale}`);
      setItems(res.data ?? []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Failed to load categories. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const tree = useMemo(() => buildTree(items), [items]);
  const rows = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpanded(new Set(items.map((x) => x.id)));
  };

  const collapseAll = () => {
    setExpanded(new Set());
  };

  const handleDelete = async (id: number) => {
    // მინიმალური confirm (შეგიძლია modal-იც მერე)
    const ok = confirm("Delete this category?");
    if (!ok) return;

    try {
      await api.delete(`/categories/${id}`);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage category tree (parents, children, nested).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={expandAll}>
            Expand all
          </Button>
          <Button variant="secondary" onClick={collapseAll}>
            Collapse all
          </Button>
          <Button asChild variant="primary">
            <Link href={`/${locale}/admin/categories/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add category
            </Link>
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
                    {/* indent */}
                    <div style={{ width: depth * 18 }} />

                    {/* expand/collapse */}
                    {hasChildren ? (
                      <button
                        type="button"
                        onClick={() => toggle(node.id)}
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
                      onClick={() => handleDelete(node.id)}
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

      <div className="mt-3 text-xs text-muted-foreground">
        Tip: Create a parent category first (e.g. Electronics), then add
        subcategories under it.
      </div>
    </div>
  );
}

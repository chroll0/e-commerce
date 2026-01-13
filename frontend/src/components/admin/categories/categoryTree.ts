// components/categories/categoryTree.ts
export type CategoryApi = {
  id: number;
  slug: string;
  parentId: number | null;
  translations: { locale: string; name: string }[];
  createdAt?: string;
};

export type CategoryNode = {
  id: number;
  slug: string;
  parentId: number | null;
  name: string;
  children: CategoryNode[];
};

export function buildTree(categories: CategoryApi[]) {
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

export function flattenTree(
  roots: CategoryNode[],
  expanded: Set<number>,
  depth = 0
) {
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

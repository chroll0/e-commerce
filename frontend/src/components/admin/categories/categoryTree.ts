import { CategoryApi, CategoryNode, CategoryRow } from "@/types";

function computeTotals(node: CategoryNode): number {
  const own = node.products ?? 0;
  const kids = node.children.reduce((sum, ch) => sum + computeTotals(ch), 0);
  node.productsTotal = own + kids;
  return node.productsTotal;
}

export function buildTree(categories: CategoryApi[]) {
  const nodes = new Map<number, CategoryNode>();

  for (const c of categories) {
    nodes.set(c.id, {
      id: c.id,
      slug: c.slug,
      parentId: c.parentId ?? null,
      name: c.translations?.[0]?.name ?? c.slug,
      children: [],
      products: c._count?.products ?? 0,
      productsTotal: 0,
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
  roots.forEach(computeTotals);

  return roots;
}

export function flattenTree(
  roots: CategoryNode[],
  expanded: Set<number>,
  depth = 0,
  ancestorLast: boolean[] = [],
): CategoryRow[] {
  const rows: CategoryRow[] = [];

  roots.forEach((node, index) => {
    const hasChildren = node.children.length > 0;
    const isLast = index === roots.length - 1;

    rows.push({
      node,
      depth,
      hasChildren,
      isLast,
      ancestorLast,
    });

    if (hasChildren && expanded.has(node.id)) {
      rows.push(
        ...flattenTree(node.children, expanded, depth + 1, [
          ...ancestorLast,
          isLast,
        ]),
      );
    }
  });

  return rows;
}

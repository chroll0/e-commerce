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

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildIndentedOptions(list: CategoryOption[]) {
  const byParent = new Map<number | null, CategoryOption[]>();
  for (const c of list) {
    const key = c.parentId ?? null;
    const arr = byParent.get(key) ?? [];
    arr.push(c);
    byParent.set(key, arr);
  }

  for (const arr of byParent.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  const result: { id: number; label: string }[] = [];

  const dfs = (parentId: number | null, depth: number) => {
    const children = byParent.get(parentId) ?? [];
    for (const c of children) {
      const prefix = depth === 0 ? "" : `${"— ".repeat(depth)}`;
      result.push({ id: c.id, label: `${prefix}${c.name}` });
      dfs(c.id, depth + 1);
    }
  };

  dfs(null, 0);
  return result;
}

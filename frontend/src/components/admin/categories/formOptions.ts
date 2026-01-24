import { CategoryOption } from "@/types";

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

  const INDENT = "\u00A0\u00A0\u00A0";

  const dfs = (parentId: number | null, prefixParts: boolean[]) => {
    const children = byParent.get(parentId) ?? [];

    children.forEach((c, idx) => {
      const isLast = idx === children.length - 1;

      const prefix =
        prefixParts.map(() => INDENT).join("") +
        (prefixParts.length ? (isLast ? "└─ " : "├─ ") : "");

      result.push({ id: c.id, label: `${prefix}${c.name}` });

      dfs(c.id, [...prefixParts, !isLast]);
    });
  };

  dfs(null, []);
  return result;
}

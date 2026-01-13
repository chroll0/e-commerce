// components/categories/CategoriesHeader.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components";
import { Plus } from "lucide-react";
import { FC } from "react";

type Props = {
  locale: "en" | "ka";
  onExpandAll: () => void;
  onCollapseAll: () => void;
};

const CategoriesHeader: FC<Props> = ({
  locale,
  onExpandAll,
  onCollapseAll,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage category tree (parents, children, nested).
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onExpandAll}>
          Expand all
        </Button>
        <Button variant="secondary" onClick={onCollapseAll}>
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
  );
};

export default CategoriesHeader;

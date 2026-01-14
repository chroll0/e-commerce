import Link from "next/link";
import { Button } from "@/components";
import { Plus } from "lucide-react";
import { FC } from "react";
import { HeaderProps } from "@/types";

const CategoriesHeader: FC<HeaderProps> = ({
  locale,
  onExpandAll,
  onCollapseAll,
  title,
  description,
  expandAllLabel,
  collapseAllLabel,
  addLabel,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onExpandAll}>
          {expandAllLabel}
        </Button>
        <Button variant="outline" size="sm" onClick={onCollapseAll}>
          {collapseAllLabel}
        </Button>

        <Button asChild variant="tertiary" size="sm">
          <Link href={`/${locale}/admin/categories/new`}>
            <Plus className="h-4 w-4 mr-2" />
            {addLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;

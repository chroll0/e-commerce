import Link from "next/link";
import { Button } from "@/components";
import { Plus } from "lucide-react";
import { FC } from "react";

type props = {
  locale: "en" | "ka";
  title: string;
  description: string;
  addLabel: string;
};

const CategoriesHeader: FC<props> = ({
  locale,
  title,
  description,
  addLabel,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button asChild variant="tertiary" size="sm">
        <Link href={`/${locale}/admin/categories/new`}>
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Link>
      </Button>
    </div>
  );
};

export default CategoriesHeader;

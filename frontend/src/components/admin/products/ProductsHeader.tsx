import Link from "next/link";
import { Button } from "@/components";
import { Plus } from "lucide-react";
import { FC } from "react";

type Props = {
  locale: string;
  title: string;
  description: string;
  addLabel: string;
};

const ProductsHeader: FC<Props> = ({
  locale,
  title,
  description,
  addLabel,
}) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Button asChild>
        <Link href={`/${locale}/admin/products/new`}>
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Link>
      </Button>
    </div>
  );
};

export default ProductsHeader;

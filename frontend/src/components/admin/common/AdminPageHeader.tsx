import { FC, ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components";
import { Plus } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
  addHref?: string;
  addLabel?: string;
};

const AdminPageHeader: FC<Props> = ({
  title,
  description,
  actions,
  addHref,
  addLabel,
}) => {
  const showAdd = Boolean(addHref && addLabel);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}

        {showAdd && (
          <Button asChild variant="tertiary" size="sm">
            <Link href={addHref!}>
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;

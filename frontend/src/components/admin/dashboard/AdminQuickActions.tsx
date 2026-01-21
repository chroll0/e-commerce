"use client";

import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components";
import { Plus, Boxes, Users, Layers } from "lucide-react";

type Props = {
  locale: string;
};

const AdminQuickActions: FC<Props> = ({ locale }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-sm font-medium">Quick actions</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/products/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Add product
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/categories/new`}>
            <Layers className="h-4 w-4 mr-2" />
            Add category
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/products`}>
            <Boxes className="h-4 w-4 mr-2" />
            Products
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/users`}>
            <Users className="h-4 w-4 mr-2" />
            Users
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminQuickActions;

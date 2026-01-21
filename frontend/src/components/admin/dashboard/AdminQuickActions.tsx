import Link from "next/link";
import { FC } from "react";
import { Button } from "@/components";
import { Plus, Boxes, Users, Layers, ExternalLink } from "lucide-react";
import { Locale, useTranslations } from "next-intl";

const AdminQuickActions: FC<{ locale: Locale }> = ({ locale }) => {
  const t = useTranslations("admin.dashboard");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-sm font-medium">{t("quickActions")}</div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/categories/new`}>
            <Layers className="h-4 w-4 mr-2" />
            {t("actions.addCategory")}
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/products/new`}>
            <Boxes className="h-4 w-4 mr-2" />
            {t("actions.addProduct")}
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}/admin/users`}>
            <Users className="h-4 w-4 mr-2" />
            {t("actions.viewUsers")}
          </Link>
        </Button>

        <Button asChild variant="secondary" size="sm">
          <Link href={`/${locale}`}>
            <ExternalLink className="h-4 w-4 mr-2" />
            {t("actions.backToSite")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminQuickActions;

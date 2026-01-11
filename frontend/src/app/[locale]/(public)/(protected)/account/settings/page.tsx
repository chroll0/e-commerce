"use client";

import { AccountHeader, Button } from "@/components";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations("account.settings");
  return (
    <div className="mx-auto w-full max-w-5xl py-10">
      <AccountHeader
        title={t("title")}
        description={t("description")}
        action={<Button type="submit">{t("save")}</Button>}
      />
    </div>
  );
};

export default page;

import { ReactNode } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerList = await headers();
  const locale =
    headerList.get("x-locale") ||
    headerList.get("accept-language")?.split(",")[0]?.split("-")[0] ||
    "en";

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) {
    redirect(`/${locale}/auth/login`);
  }

  const res = await fetch(`${API_URL}auth/me`, {
    headers: {
      Cookie: `access_token=${token.value}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    redirect(`/${locale}/auth/login`);
  }

  const user = await res.json();

  const role =
    typeof user.role === "string"
      ? user.role.trim().toLowerCase()
      : typeof user.user?.role === "string"
      ? user.user.role.trim().toLowerCase()
      : null;

  if (role !== "admin") {
    redirect(`/${locale}`);
  }

  const t = await getTranslations({
    locale,
    namespace: "admin",
  });

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar locale={locale} />

      <main className="flex-1">
        <header className="h-16 border-b bg-background flex items-center px-6">
          <h1 className="text-lg font-medium">{t("header.title")}</h1>
        </header>

        <section className="p-6">{children}</section>
      </main>
    </div>
  );
}

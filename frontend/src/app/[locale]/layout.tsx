import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers, LoadingProvider, NotificationCenter } from "@/components";
import { Locale } from "@/types";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale: Locale = locale === "ka" ? "ka" : "en";
  const messages = await getMessages({ locale: safeLocale });

  return (
    <Providers>
      <LoadingProvider>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <NotificationCenter />
          <>{children}</>
        </NextIntlClientProvider>
      </LoadingProvider>
    </Providers>
  );
}

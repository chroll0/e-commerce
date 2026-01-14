import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers, LoadingProvider } from "@/components";
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
          <>{children}</>
        </NextIntlClientProvider>
      </LoadingProvider>
    </Providers>
  );
}

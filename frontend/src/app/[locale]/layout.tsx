import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navigation, PageWrapper, Footer } from "@/components";
import Providers from "../providers";

type Locale = "en" | "ka";

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
      <NextIntlClientProvider locale={safeLocale} messages={messages}>
        <Navigation />
        <PageWrapper>{children}</PageWrapper>
        <Footer />
      </NextIntlClientProvider>
    </Providers>
  );
}

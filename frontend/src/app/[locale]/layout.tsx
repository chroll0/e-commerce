import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Navigation, PageWrapper, Footer } from "@/components";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "ka" }>;
}) {
  const { locale } = await params;

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navigation />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
    </NextIntlClientProvider>
  );
}

export const formatCurrency = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2,
  }).format(value);

export const formatDate = (value: string, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const getProductTitle = (
  product: { slug: string; translations?: { locale: string; title: string }[] },
  locale: string,
) =>
  product.translations?.find((translation) => translation.locale === locale)
    ?.title ??
  product.translations?.[0]?.title ??
  product.slug;

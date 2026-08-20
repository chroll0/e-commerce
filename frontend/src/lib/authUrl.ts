const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export function getOAuthUrl(provider: "google" | "apple", locale: string) {
  const url = new URL(`${apiBaseUrl}/auth/${provider}`);
  url.searchParams.set("locale", locale);
  return url.toString();
}

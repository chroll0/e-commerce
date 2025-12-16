import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ka"];
const fallbackLocale = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/");
  const localeInPath = locales.includes(segments[1]) ? segments[1] : null;

  if (localeInPath) {
    return NextResponse.next();
  }

  const localeFromCookie =
    req.cookies.get("NEXT_LOCALE")?.value || fallbackLocale;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${localeFromCookie}`, req.url));
  }

  return NextResponse.redirect(
    new URL(`/${localeFromCookie}${pathname}`, req.url)
  );
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico|css|js|woff|woff2|ttf)).*)",
  ],
};

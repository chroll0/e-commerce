import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ka"];
const defaultLocale = "en";
const protectedPrefixes = ["/account", "/checkout", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, req.url));
  }

  const segments = pathname.split("/");
  const locale = locales.includes(segments[1]) ? segments[1] : null;

  if (!locale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, req.url)
    );
  }

  const pathAfterLocale = `/${segments.slice(2).join("/")}`;

  const isProtected = protectedPrefixes.some(
    (prefix) =>
      pathAfterLocale === prefix || pathAfterLocale.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }

  try {
    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL(`/${locale}/auth/login`, req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|flags).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/about"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 1️⃣ Allow public & auth routes
  if (pathname.startsWith("/auth") || PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 2️⃣ Read token from cookie
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 3️⃣ Verify token via backend
  try {
    const verifyRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
      {
        method: "GET",
        headers: {
          cookie: `access_token=${token}`,
        },
      }
    );

    // 4️⃣ Invalid / expired token
    if (!verifyRes.ok) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    // 5️⃣ Token is valid → allow
    return NextResponse.next();
  } catch (error) {
    // backend unreachable / network error
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};

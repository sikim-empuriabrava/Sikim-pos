import { NextRequest, NextResponse } from "next/server";
import { POS_SESSION_COOKIE_NAME, verifyPosSession } from "@/lib/pos-auth";

const PUBLIC_PATHS = new Set([
  "/login",
  "/api/pos-auth/login",
  "/api/pos-auth/logout",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

const PUBLIC_PATH_PREFIXES = ["/_next/"];

function isPublicPath(pathname: string) {
  return (
    PUBLIC_PATHS.has(pathname) ||
    PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  );
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isAuthorized = await verifyPosSession(
    request.cookies.get(POS_SESSION_COOKIE_NAME)?.value,
  );

  if (isAuthorized) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

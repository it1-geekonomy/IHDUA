import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Expose pathname to the root layout so Kannada paint-hold can skip /admin. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Old /blogs URLs → /blog (keep labels; rename path only).
  if (pathname === "/blogs" || pathname.startsWith("/blogs/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/blogs/, "/blog");
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};

import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // /admin (Russian-only, single admin user) and /account (Russian-only
  // client portal) both live outside the /ru /es /en locale routing and
  // only need their Supabase session cookie kept fresh.
  if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/account")) {
    return updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

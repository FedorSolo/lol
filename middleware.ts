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
  // Excludes:
  //  - Next.js internals (_next/static, _next/image)
  //  - any request for a static file by extension (icons, images, robots.txt,
  //    sitemap.xml, manifest, fonts, etc.) — this is deliberately broad so a
  //    new file dropped into /public never needs a middleware update to be
  //    reachable (this bit us twice already with sitemap.xml/robots.txt and
  //    a logo image getting 404'd by the locale router)
  //  - /admin and /account, handled separately above
  matcher: ["/((?!_next/static|_next/image|.*\\.[\\w]+$).*)"],
};

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next internals — cheapest
     * way to keep the auth cookie fresh wherever /admin might redirect from.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};

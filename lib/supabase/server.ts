import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

/**
 * Server Component / Route Handler client, bound to the request's cookies.
 * Uses the public anon key — same RLS restrictions as the browser client.
 * Use this for reading published content on the public site.
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies (no
            // response to attach to) — safe to ignore as long as
            // middleware.ts is also refreshing the session.
          }
        },
      },
    }
  );
}

/**
 * Privileged admin client using SUPABASE_SERVICE_ROLE_KEY. Bypasses RLS
 * entirely — only ever import this in server-side code that lives behind
 * the /admin auth gate (route handlers, server actions). NEVER import this
 * from a Client Component or anything bundled for the browser.
 */
export function createAdminSupabaseClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

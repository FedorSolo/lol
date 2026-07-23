import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

/**
 * Client-side Supabase client. Uses the public anon/publishable key, which
 * is safe to expose to the browser — RLS on the database restricts it to
 * published content only (see supabase/migrations/0001_init.sql).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function updateMyPhone(phone: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Не авторизован" };

  // RLS ("clients update own profile") already restricts this to the
  // caller's own row — the .eq is just belt-and-braces clarity.
  const { error } = await supabase.from("client_profiles").update({ phone }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/account");
  return { ok: true };
}

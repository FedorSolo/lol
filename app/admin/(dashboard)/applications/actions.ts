"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";
import { generatePassword } from "@/lib/generate-password";

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("applications").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function getInvitedEmails(): Promise<string[]> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("client_profiles").select("email");
  return (data ?? []).map((row) => row.email);
}

export async function inviteClient(
  applicationId: string
): Promise<ActionResultWithData<{ email: string; password: string }>> {
  const supabase = createAdminSupabaseClient();

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) return { ok: false, error: "Заявка не найдена" };

  const { data: existing } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("email", application.email)
    .maybeSingle();

  if (existing) return { ok: false, error: "Этот клиент уже приглашён" };

  const password = generatePassword();

  const { data: authResult, error: authError } = await supabase.auth.admin.createUser({
    email: application.email,
    password,
    email_confirm: true,
  });

  if (authError || !authResult.user) {
    return { ok: false, error: authError?.message ?? "Не удалось создать пользователя" };
  }

  const { error: profileError } = await supabase.from("client_profiles").insert({
    id: authResult.user.id,
    email: application.email,
    full_name: `${application.first_name} ${application.last_name}`.trim(),
    phone: application.whatsapp ?? application.telegram ?? null,
    expedition_id: application.expedition_id,
    application_id: application.id,
  });

  if (profileError) {
    // Roll back the auth user so we don't leave an orphaned account with
    // no profile if the second insert fails.
    await supabase.auth.admin.deleteUser(authResult.user.id);
    return { ok: false, error: profileError.message };
  }

  revalidatePath("/admin/applications");
  return { ok: true, data: { email: application.email, password } };
}

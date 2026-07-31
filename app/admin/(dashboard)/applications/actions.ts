"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";
import { generatePassword } from "@/lib/generate-password";
import { sendClientInviteEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site-url";

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

export interface ApplicationEditData {
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  telegram: string;
  country: string;
  age: string;
  expedition_id: string;
}

export async function updateApplicationDetails(
  id: string,
  data: ApplicationEditData
): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("applications")
    .update({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      whatsapp: data.whatsapp || null,
      telegram: data.telegram || null,
      country: data.country || null,
      age: data.age ? Number(data.age) : null,
      expedition_id: data.expedition_id || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function deleteApplications(ids: string[]): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("applications").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/applications");
  return { ok: true };
}

export async function getInvitedEmails(): Promise<string[]> {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase.from("client_profiles").select("email");
  return (data ?? []).map((row) => row.email);
}

type InviteResultData = {
  email: string;
  password: string;
  emailSent: boolean;
  emailError?: string;
};

export async function inviteClient(
  applicationId: string
): Promise<ActionResultWithData<InviteResultData>> {
  const supabase = createAdminSupabaseClient();
  console.log(`[inviteClient] Starting for application ${applicationId}`);

  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", applicationId)
    .single();

  if (appError || !application) {
    console.error("[inviteClient] Application not found:", appError?.message);
    return { ok: false, error: "Заявка не найдена" };
  }

  const { data: existing } = await supabase
    .from("client_profiles")
    .select("id")
    .eq("email", application.email)
    .maybeSingle();

  if (existing) return { ok: false, error: "Этот клиент уже приглашён" };

  const password = generatePassword();
  const fullName = `${application.first_name} ${application.last_name}`.trim();

  const { data: authResult, error: authError } = await supabase.auth.admin.createUser({
    email: application.email,
    password,
    email_confirm: true,
  });

  if (authError || !authResult.user) {
    console.error("[inviteClient] createUser failed:", authError?.message);
    return { ok: false, error: authError?.message ?? "Не удалось создать пользователя" };
  }

  const { error: profileError } = await supabase.from("client_profiles").insert({
    id: authResult.user.id,
    email: application.email,
    full_name: fullName,
    phone: application.whatsapp ?? application.telegram ?? null,
    expedition_id: application.expedition_id,
    application_id: application.id,
  });

  if (profileError) {
    console.error("[inviteClient] client_profiles insert failed:", profileError.message);
    // Roll back the auth user so we don't leave an orphaned account with
    // no profile if the second insert fails.
    await supabase.auth.admin.deleteUser(authResult.user.id);
    return { ok: false, error: profileError.message };
  }

  console.log(`[inviteClient] Profile created for ${application.email}, sending email...`);
  const emailResult = await sendClientInviteEmail({
    to: application.email,
    fullName,
    email: application.email,
    password,
    loginUrl: `${SITE_URL}/account/login`,
  });
  console.log(`[inviteClient] Email result: sent=${emailResult.sent} error=${emailResult.error ?? "none"}`);

  revalidatePath("/admin/applications");
  return {
    ok: true,
    data: {
      email: application.email,
      password,
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    },
  };
}

// Regenerates the client's password and re-sends the login email — for
// when the first email didn't arrive, or the client lost their password.
export async function resendClientInvite(
  applicationEmail: string
): Promise<ActionResultWithData<InviteResultData>> {
  const supabase = createAdminSupabaseClient();
  console.log(`[resendClientInvite] Starting for ${applicationEmail}`);

  const { data: profile, error: profileError } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("email", applicationEmail)
    .single();

  if (profileError || !profile) {
    return { ok: false, error: "Клиентский аккаунт не найден" };
  }

  const password = generatePassword();
  const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, { password });

  if (updateError) {
    console.error("[resendClientInvite] updateUserById failed:", updateError.message);
    return { ok: false, error: updateError.message };
  }

  const emailResult = await sendClientInviteEmail({
    to: profile.email,
    fullName: profile.full_name,
    email: profile.email,
    password,
    loginUrl: `${SITE_URL}/account/login`,
  });
  console.log(`[resendClientInvite] Email result: sent=${emailResult.sent} error=${emailResult.error ?? "none"}`);

  return {
    ok: true,
    data: {
      email: profile.email,
      password,
      emailSent: emailResult.sent,
      emailError: emailResult.error,
    },
  };
}

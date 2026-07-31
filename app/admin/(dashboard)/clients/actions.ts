"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function getClients() {
  const supabase = createAdminSupabaseClient();
  const { data: clients } = await supabase
    .from("client_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (!clients || clients.length === 0) return [];

  const expeditionIds = clients.map((c) => c.expedition_id).filter((id): id is string => Boolean(id));
  const { data: expeditions } =
    expeditionIds.length > 0
      ? await supabase.from("expeditions").select("*").in("id", expeditionIds)
      : { data: [] as { id: string; slug: string }[] };
  const { data: expeditionI18n } =
    expeditionIds.length > 0
      ? await supabase.from("expedition_i18n").select("*").in("expedition_id", expeditionIds).eq("locale", "ru")
      : { data: [] as { expedition_id: string; title: string }[] };

  return clients.map((client) => ({
    ...client,
    expeditionTitle: client.expedition_id
      ? expeditionI18n?.find((t) => t.expedition_id === client.expedition_id)?.title ??
        expeditions?.find((e) => e.id === client.expedition_id)?.slug ??
        null
      : null,
  }));
}

export interface ClientEditData {
  full_name: string;
  phone: string;
  expedition_id: string;
}

export async function updateClient(id: string, data: ClientEditData): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("client_profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone || null,
      expedition_id: data.expedition_id || null,
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/clients");
  return { ok: true };
}

export async function getClientDetail(id: string) {
  const supabase = createAdminSupabaseClient();
  const [{ data: profile }, { data: questionnaire }, { data: videos }] = await Promise.all([
    supabase.from("client_profiles").select("*").eq("id", id).maybeSingle(),
    supabase.from("client_questionnaire_responses").select("*").eq("client_id", id).maybeSingle(),
    supabase
      .from("client_training_videos")
      .select("*")
      .eq("client_id", id)
      .order("uploaded_at", { ascending: false }),
  ]);

  if (!profile) return null;

  let expeditionTitle: string | null = null;
  if (profile.expedition_id) {
    const { data: t } = await supabase
      .from("expedition_i18n")
      .select("*")
      .eq("expedition_id", profile.expedition_id)
      .eq("locale", "ru")
      .maybeSingle();
    expeditionTitle = t?.title ?? null;
  }

  const videosWithUrls = (videos ?? []).map((v) => ({
    ...v,
    url: supabase.storage.from("media").getPublicUrl(v.storage_path).data.publicUrl,
  }));

  return { profile, expeditionTitle, questionnaire, videos: videosWithUrls };
}

export async function saveTrainingPlan(id: string, plan: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("client_profiles")
    .update({ training_plan: plan || null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/clients/${id}`);
  revalidatePath("/account/training", "page");
  return { ok: true };
}

export async function deleteClientVideo(videoId: string, storagePath: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("client_training_videos").delete().eq("id", videoId);
  if (error) return { ok: false, error: error.message };
  await supabase.storage.from("media").remove([storagePath]);
  return { ok: true };
}

export async function deleteClient(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  // Deletes the auth user, which cascades to client_profiles (FK "on
  // delete cascade") — this fully removes their ability to log in, not
  // just the profile row.
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/clients");
  return { ok: true };
}

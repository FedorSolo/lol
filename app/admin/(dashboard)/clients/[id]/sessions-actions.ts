"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";

export async function getClientSessions(clientId: string) {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("client_id", clientId)
    .order("session_date");
  return data ?? [];
}

export interface SessionFormData {
  id?: string;
  client_id: string;
  session_date: string; // yyyy-mm-dd
  title: string;
  session_type: string;
  duration_minutes: string;
  distance_km: string;
  elevation_gain_m: string;
  description: string;
}

export async function saveSession(
  form: SessionFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const payload = {
    client_id: form.client_id,
    session_date: form.session_date,
    title: form.title,
    session_type: form.session_type,
    duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
    distance_km: form.distance_km ? Number(form.distance_km) : null,
    elevation_gain_m: form.elevation_gain_m ? Number(form.elevation_gain_m) : null,
    description: form.description || null,
  };

  let id = form.id;
  if (id) {
    const { error } = await supabase.from("training_sessions").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("training_sessions")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  revalidatePath(`/admin/clients/${form.client_id}`);
  revalidatePath("/account/training", "page");
  return { ok: true, data: { id } };
}

export async function deleteSession(id: string, clientId: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("training_sessions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/account/training", "page");
  return { ok: true };
}

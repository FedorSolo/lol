"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";
import { sendTrainingSessionEmail } from "@/lib/email";
import { googleCalendarLink } from "@/lib/calendar";
import { SITE_URL } from "@/lib/site-url";

const SESSION_TYPE_LABELS: Record<string, string> = {
  cardio: "Кардио",
  strength: "Силовая",
  hike: "Поход",
  altitude: "Высотная",
  rest: "Отдых",
  other: "Тренировка",
};

export async function getClientSessions(clientId: string) {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("training_sessions")
    .select("*")
    .eq("client_id", clientId)
    .order("session_date");
  return data ?? [];
}

export async function getExerciseVideosBySessionIds(
  sessionIds: string[]
): Promise<Record<string, ExerciseVideoFormData[]>> {
  if (sessionIds.length === 0) return {};
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("session_exercise_videos")
    .select("*")
    .in("session_id", sessionIds)
    .order("sort_order");

  const grouped: Record<string, ExerciseVideoFormData[]> = {};
  for (const row of data ?? []) {
    if (!grouped[row.session_id]) grouped[row.session_id] = [];
    grouped[row.session_id]!.push(row);
  }
  return grouped;
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
  notify_client?: boolean;
}

export async function saveSession(
  form: SessionFormData
): Promise<ActionResultWithData<{ id: string; emailSent?: boolean; emailError?: string }>> {
  const supabase = createAdminSupabaseClient();
  const isNew = !form.id;

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

  // Notify the client by email only when a NEW session is created (not on
  // every edit) and only if the admin left "Уведомить письмом" checked.
  let emailSent: boolean | undefined;
  let emailError: string | undefined;
  if (isNew && form.notify_client) {
    const { data: client } = await supabase
      .from("client_profiles")
      .select("*")
      .eq("id", form.client_id)
      .maybeSingle();

    if (client) {
      const result = await sendTrainingSessionEmail({
        to: client.email,
        fullName: client.full_name,
        title: form.title,
        dateStr: form.session_date,
        typeLabel: SESSION_TYPE_LABELS[form.session_type] ?? "Тренировка",
        description: form.description || null,
        calendarLink: googleCalendarLink({
          title: form.title,
          dateStr: form.session_date,
          description: form.description || undefined,
        }),
        portalUrl: `${SITE_URL}/account/training`,
      });
      emailSent = result.sent;
      emailError = result.error;
    }
  }

  return { ok: true, data: { id, emailSent, emailError } };
}

export async function getExerciseVideos(sessionId: string) {
  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("session_exercise_videos")
    .select("*")
    .eq("session_id", sessionId)
    .order("sort_order");
  return data ?? [];
}

export interface ExerciseVideoFormData {
  id?: string;
  session_id: string;
  exercise_name: string;
  video_url: string;
  sort_order: number;
}

export async function saveExerciseVideo(
  form: ExerciseVideoFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const payload = {
    session_id: form.session_id,
    exercise_name: form.exercise_name,
    video_url: form.video_url,
    sort_order: form.sort_order,
  };

  let id = form.id;
  if (id) {
    const { error } = await supabase.from("session_exercise_videos").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("session_exercise_videos")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id;
  }

  revalidatePath("/account/training", "page");
  return { ok: true, data: { id } };
}

export async function deleteExerciseVideo(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("session_exercise_videos").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/account/training", "page");
  return { ok: true };
}

export async function deleteSession(id: string, clientId: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("training_sessions").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/account/training", "page");
  return { ok: true };
}

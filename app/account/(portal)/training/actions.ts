"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient, createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function toggleSessionCompleted(id: string, completed: boolean): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("training_sessions")
    .update({ is_completed: completed })
    .eq("id", id)
    .eq("client_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/account/training");
  return { ok: true };
}

export interface QuestionnaireData {
  emergency_contact_name: string;
  emergency_contact_phone: string;
  height_cm: string;
  weight_kg: string;
  resting_heart_rate: string;
  chronic_conditions: string;
  current_medications: string;
  allergies: string;
  recent_training_summary: string;
  longest_altitude_reached_m: string;
  additional_notes: string;
}

export async function saveMyQuestionnaire(data: QuestionnaireData): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase.from("client_questionnaire_responses").upsert(
    {
      client_id: user.id,
      emergency_contact_name: data.emergency_contact_name || null,
      emergency_contact_phone: data.emergency_contact_phone || null,
      height_cm: data.height_cm ? Number(data.height_cm) : null,
      weight_kg: data.weight_kg ? Number(data.weight_kg) : null,
      resting_heart_rate: data.resting_heart_rate ? Number(data.resting_heart_rate) : null,
      chronic_conditions: data.chronic_conditions || null,
      current_medications: data.current_medications || null,
      allergies: data.allergies || null,
      recent_training_summary: data.recent_training_summary || null,
      longest_altitude_reached_m: data.longest_altitude_reached_m
        ? Number(data.longest_altitude_reached_m)
        : null,
      additional_notes: data.additional_notes || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_id" }
  );

  if (error) return { ok: false, error: error.message };
  revalidatePath("/account/training");
  return { ok: true };
}

// The video FILE is uploaded directly from the browser to Supabase
// Storage (see VideoUploader.tsx) — this action only records the
// resulting metadata row, so the payload here is tiny regardless of the
// video's size.
export async function recordTrainingVideo(storagePath: string, note: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase.from("client_training_videos").insert({
    client_id: user.id,
    storage_path: storagePath,
    note: note || null,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/account/training");
  return { ok: true };
}

export async function deleteTrainingVideo(id: string, storagePath: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  // Delete the DB row via the user's own session (RLS: only their own
  // rows), and the underlying file via the admin client (simplest way to
  // guarantee cleanup regardless of storage RLS edge cases).
  const { error } = await supabase
    .from("client_training_videos")
    .delete()
    .eq("id", id)
    .eq("client_id", user.id);
  if (error) return { ok: false, error: error.message };

  const admin = createAdminSupabaseClient();
  await admin.storage.from("media").remove([storagePath]);

  revalidatePath("/account/training");
  return { ok: true };
}

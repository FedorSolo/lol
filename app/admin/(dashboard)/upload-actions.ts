"use server";

import { createAdminSupabaseClient } from "@/lib/supabase/server";

const BUCKET = "media";

export async function uploadMedia(
  formData: FormData
): Promise<{ path: string; url: string } | { error: string }> {
  const file = formData.get("file") as File | null;
  const folder = String(formData.get("folder") ?? "misc").replace(/[^a-z0-9_-]/gi, "");

  if (!file || file.size === 0) return { error: "Файл не выбран" };
  if (file.size > 8 * 1024 * 1024) return { error: "Файл больше 8 МБ" };

  const supabase = createAdminSupabaseClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteMedia(path: string) {
  const supabase = createAdminSupabaseClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { ActionResult, ActionResultWithData } from "@/lib/action-result";

const LOCALES: Locale[] = ["ru", "es", "en"];

export async function getTeamMembers() {
  const supabase = createAdminSupabaseClient();
  const { data: members } = await supabase.from("team_members").select("*").order("sort_order");
  const { data: i18n } = await supabase.from("team_members_i18n").select("*");

  return (members ?? []).map((m) => ({
    ...m,
    i18n: (i18n ?? []).filter((row) => row.member_id === m.id),
  }));
}

export interface TeamMemberFormData {
  id?: string;
  storage_path: string | null;
  years_experience: string;
  stat_secondary_value: string;
  stat_secondary_label_key: string;
  instagram_url: string;
  is_published: boolean;
  sort_order: number;
  i18n: Record<Locale, { name: string; role: string; bio: string }>;
}

export async function saveTeamMember(
  form: TeamMemberFormData
): Promise<ActionResultWithData<{ id: string }>> {
  const supabase = createAdminSupabaseClient();

  const payload = {
    storage_path: form.storage_path,
    years_experience: form.years_experience ? Number(form.years_experience) : null,
    stat_secondary_value: form.stat_secondary_value || null,
    stat_secondary_label_key: form.stat_secondary_label_key || null,
    instagram_url: form.instagram_url || null,
    is_published: form.is_published,
    sort_order: form.sort_order,
  };

  let memberId = form.id;

  if (memberId) {
    const { error } = await supabase.from("team_members").update(payload).eq("id", memberId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from("team_members").insert(payload).select("id").single();
    if (error) return { ok: false, error: error.message };
    memberId = data.id;
  }

  for (const locale of LOCALES) {
    const t = form.i18n[locale];
    if (!t?.name) continue;
    const { error } = await supabase
      .from("team_members_i18n")
      .upsert(
        { member_id: memberId, locale, name: t.name, role: t.role, bio: t.bio || null },
        { onConflict: "member_id,locale" }
      );
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/team");
  revalidatePath("/[locale]", "page");
  return { ok: true, data: { id: memberId } };
}

export async function deleteTeamMember(id: string): Promise<ActionResult> {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/team");
  revalidatePath("/[locale]", "page");
  return { ok: true };
}

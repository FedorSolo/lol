import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Locale } from "@/lib/supabase/database.types";
import type { PublicTeamMember } from "./team-shared";

export async function getPublicTeamMembers(locale: Locale): Promise<PublicTeamMember[]> {
  const supabase = createServerSupabaseClient();

  const { data: members } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (!members || members.length === 0) return [];

  const { data: i18n } = await supabase
    .from("team_members_i18n")
    .select("*")
    .in(
      "member_id",
      members.map((m) => m.id)
    )
    .eq("locale", locale);

  return members
    .map((m) => {
      const t = i18n?.find((row) => row.member_id === m.id);
      if (!t) return null;
      return {
        id: m.id,
        photoUrl: m.storage_path,
        yearsExperience: m.years_experience,
        statValue: m.stat_secondary_value,
        statLabel: m.stat_secondary_label_key,
        instagramUrl: m.instagram_url,
        name: t.name,
        role: t.role,
        bio: t.bio,
      };
    })
    .filter((m): m is PublicTeamMember => m !== null);
}

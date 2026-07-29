import { getTeamMembers } from "./actions";
import TeamBoard from "./TeamBoard";
import type { Locale } from "@/lib/supabase/database.types";
import type { TeamMemberFormData } from "./actions";

export default async function TeamPage() {
  const members = await getTeamMembers();

  const data: TeamMemberFormData[] = members.map((m) => ({
    id: m.id,
    storage_path: m.storage_path,
    years_experience: m.years_experience?.toString() ?? "",
    stat_secondary_value: m.stat_secondary_value ?? "",
    stat_secondary_label_key: m.stat_secondary_label_key ?? "",
    is_published: m.is_published,
    sort_order: m.sort_order,
    i18n: {
      ru: m.i18n.find((r) => r.locale === "ru") ?? { name: "", role: "", bio: "" },
      es: m.i18n.find((r) => r.locale === "es") ?? { name: "", role: "", bio: "" },
      en: m.i18n.find((r) => r.locale === "en") ?? { name: "", role: "", bio: "" },
    } as Record<Locale, { name: string; role: string; bio: string }>,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">Команда</h1>
      <TeamBoard members={data} />
    </div>
  );
}

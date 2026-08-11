"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import TeamMemberCard from "./TeamMemberCard";
import type { TeamMemberFormData } from "./actions";
import type { Locale } from "@/lib/supabase/database.types";

const emptyI18n = { name: "", role: "", bio: "" };

function blankMember(sortOrder: number): TeamMemberFormData {
  return {
    storage_path: null,
    years_experience: "",
    stat_secondary_value: "",
    stat_secondary_label_key: "",
    instagram_url: "",
    is_published: true,
    sort_order: sortOrder,
    i18n: { ru: { ...emptyI18n }, es: { ...emptyI18n }, en: { ...emptyI18n } } as Record<
      Locale,
      { name: string; role: string; bio: string }
    >,
  };
}

export default function TeamBoard({ members }: { members: TeamMemberFormData[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<TeamMemberFormData[]>([]);

  return (
    <div className="flex flex-col gap-6">
      {members.map((m) => (
        <TeamMemberCard key={m.id} member={m} onSaved={() => router.refresh()} />
      ))}
      {drafts.map((draft, i) => (
        <TeamMemberCard
          key={`draft-${i}`}
          member={draft}
          onSaved={() => {
            setDrafts((d) => d.filter((_, idx) => idx !== i));
            router.refresh();
          }}
        />
      ))}

      <button
        onClick={() => setDrafts((d) => [...d, blankMember(members.length + d.length)])}
        className="inline-flex items-center gap-2 self-start border border-white/20 text-snow px-5 py-2.5 text-sm hover:border-glacier-light transition-colors"
      >
        <Plus className="w-4 h-4" />
        Добавить участника
      </button>
    </div>
  );
}

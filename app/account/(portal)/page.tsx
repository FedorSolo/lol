import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireClient } from "../auth-actions";
import ProfileForm from "./ProfileForm";

export default async function AccountDashboardPage() {
  const profile = await requireClient();

  let expeditionTitle: string | null = null;
  if (profile.expedition_id) {
    const supabase = createServerSupabaseClient();
    const { data: t } = await supabase
      .from("expedition_i18n")
      .select("*")
      .eq("expedition_id", profile.expedition_id)
      .eq("locale", "ru")
      .maybeSingle();
    expeditionTitle = t?.title ?? null;
  }

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">
        Здравствуйте, {profile.full_name.split(" ")[0]}
      </h1>
      <p className="text-mist text-sm mb-10">Личный кабинет участника экспедиции CUMBRE.</p>

      {expeditionTitle && (
        <Link
          href="/account/trip"
          className="flex items-center justify-between border border-white/10 hover:border-glacier-light/40 transition-colors p-6 mb-10"
        >
          <div className="flex items-center gap-4">
            <Compass className="w-6 h-6 text-glacier-light" strokeWidth={1.5} />
            <div>
              <div className="text-xs text-mist uppercase tracking-wide mb-1">Ваша экспедиция</div>
              <div className="font-display text-xl uppercase text-snow">{expeditionTitle}</div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-mist" />
        </Link>
      )}

      <div className="border border-white/10 p-6 max-w-md">
        <h2 className="font-display text-lg uppercase text-snow tracking-wide mb-5">
          Данные профиля
        </h2>
        <div className="text-sm text-mist mb-1">Имя</div>
        <div className="text-snow mb-4">{profile.full_name}</div>
        <div className="text-sm text-mist mb-1">Email</div>
        <div className="text-snow mb-4">{profile.email}</div>
        <ProfileForm initialPhone={profile.phone ?? ""} />
      </div>
    </div>
  );
}

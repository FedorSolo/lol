import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getClientDetail } from "../actions";
import { getClientSessions } from "./sessions-actions";
import { QuestionnaireView, VideosView } from "./ClientDetailSections";
import TrainingCalendarAdmin from "./TrainingCalendarAdmin";

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const [detail, sessions] = await Promise.all([
    getClientDetail(params.id),
    getClientSessions(params.id),
  ]);
  if (!detail) notFound();

  const { profile, expeditionTitle, questionnaire, videos } = detail;

  return (
    <div>
      <Link href="/admin/clients" className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-glacier-light mb-4">
        <ArrowLeft className="w-3.5 h-3.5" />
        Назад к клиентам
      </Link>

      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-1">{profile.full_name}</h1>
      <p className="text-mist text-sm mb-10">
        {profile.email}
        {expeditionTitle && ` · ${expeditionTitle}`}
      </p>

      <section className="mb-12">
        <h2 className="font-display text-lg uppercase text-snow mb-4">Календарь тренировок</h2>
        <TrainingCalendarAdmin clientId={profile.id} initialSessions={sessions} />
      </section>

      <section className="mb-12">
        <h2 className="font-display text-lg uppercase text-snow mb-4">Опросник (заполняет клиент)</h2>
        <QuestionnaireView data={questionnaire} />
      </section>

      <section>
        <h2 className="font-display text-lg uppercase text-snow mb-4">Видео тренировок</h2>
        <VideosView videos={videos} />
      </section>
    </div>
  );
}

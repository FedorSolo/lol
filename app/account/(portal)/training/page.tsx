import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireClient } from "../../auth-actions";
import QuestionnaireForm from "./QuestionnaireForm";
import VideoUploader from "./VideoUploader";
import VideoList, { type VideoItem } from "./VideoList";
import TrainingCalendarClient from "./TrainingCalendarClient";
import type { QuestionnaireData } from "./actions";

const EMPTY_QUESTIONNAIRE: QuestionnaireData = {
  emergency_contact_name: "",
  emergency_contact_phone: "",
  height_cm: "",
  weight_kg: "",
  resting_heart_rate: "",
  chronic_conditions: "",
  current_medications: "",
  allergies: "",
  recent_training_summary: "",
  longest_altitude_reached_m: "",
  additional_notes: "",
};

export default async function TrainingPage() {
  const profile = await requireClient();
  const supabase = createServerSupabaseClient();

  const [{ data: questionnaire }, { data: videoRows }, { data: sessionRows }] = await Promise.all([
    supabase.from("client_questionnaire_responses").select("*").eq("client_id", profile.id).maybeSingle(),
    supabase
      .from("client_training_videos")
      .select("*")
      .eq("client_id", profile.id)
      .order("uploaded_at", { ascending: false }),
    supabase.from("training_sessions").select("*").eq("client_id", profile.id).order("session_date"),
  ]);

  const sessionIds = (sessionRows ?? []).map((s) => s.id);
  const { data: exerciseVideoRows } =
    sessionIds.length > 0
      ? await supabase
          .from("session_exercise_videos")
          .select("*")
          .in("session_id", sessionIds)
          .order("sort_order")
      : { data: [] as { session_id: string; id: string; exercise_name: string; video_url: string }[] };

  const videosBySession: Record<string, { id: string; exercise_name: string; video_url: string }[]> = {};
  for (const row of exerciseVideoRows ?? []) {
    if (!videosBySession[row.session_id]) videosBySession[row.session_id] = [];
    videosBySession[row.session_id]!.push({
      id: row.id,
      exercise_name: row.exercise_name,
      video_url: row.video_url,
    });
  }

  const questionnaireData: QuestionnaireData = questionnaire
    ? {
        emergency_contact_name: questionnaire.emergency_contact_name ?? "",
        emergency_contact_phone: questionnaire.emergency_contact_phone ?? "",
        height_cm: questionnaire.height_cm?.toString() ?? "",
        weight_kg: questionnaire.weight_kg?.toString() ?? "",
        resting_heart_rate: questionnaire.resting_heart_rate?.toString() ?? "",
        chronic_conditions: questionnaire.chronic_conditions ?? "",
        current_medications: questionnaire.current_medications ?? "",
        allergies: questionnaire.allergies ?? "",
        recent_training_summary: questionnaire.recent_training_summary ?? "",
        longest_altitude_reached_m: questionnaire.longest_altitude_reached_m?.toString() ?? "",
        additional_notes: questionnaire.additional_notes ?? "",
      }
    : EMPTY_QUESTIONNAIRE;

  const videos: VideoItem[] = (videoRows ?? []).map((row) => ({
    id: row.id,
    url: supabase.storage.from("media").getPublicUrl(row.storage_path).data.publicUrl,
    note: row.note,
    uploaded_at: row.uploaded_at,
  }));

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-2">Тренировки</h1>
      <p className="text-mist text-sm mb-10">
        Календарь подготовки, опросник для команды и видео с ваших тренировок.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-lg uppercase text-snow mb-4">Календарь тренировок</h2>
        <TrainingCalendarClient sessions={sessionRows ?? []} videosBySession={videosBySession} />
      </section>

      <section className="mb-12">
        <h2 className="font-display text-lg uppercase text-snow mb-4">Опросник</h2>
        <QuestionnaireForm initial={questionnaireData} />
      </section>

      <section>
        <h2 className="font-display text-lg uppercase text-snow mb-4">Видео тренировок</h2>
        <div className="mb-5">
          <VideoUploader clientId={profile.id} />
        </div>
        <VideoList videos={videos} />
      </section>
    </div>
  );
}

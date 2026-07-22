import { notFound } from "next/navigation";
import { getDifficultyLevels, getExpeditionById } from "../actions";
import ExpeditionForm from "../ExpeditionForm";

export default async function EditExpeditionPage({ params }: { params: { id: string } }) {
  const [levels, data] = await Promise.all([getDifficultyLevels(), getExpeditionById(params.id)]);

  if (!data) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">
        Редактировать экспедицию
      </h1>
      <ExpeditionForm levels={levels} initial={data as any} />
    </div>
  );
}

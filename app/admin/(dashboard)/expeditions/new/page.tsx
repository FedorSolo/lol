import { getDifficultyLevels } from "../actions";
import ExpeditionForm from "../ExpeditionForm";

export default async function NewExpeditionPage() {
  const levels = await getDifficultyLevels();

  return (
    <div>
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-8">
        Новая экспедиция
      </h1>
      <ExpeditionForm levels={levels} />
    </div>
  );
}

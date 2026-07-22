import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { getExpeditions } from "./actions";
import DeleteButton from "./DeleteButton";

export default async function ExpeditionsListPage() {
  const expeditions = await getExpeditions();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase text-snow tracking-wide">Экспедиции</h1>
        <Link
          href="/admin/expeditions/new"
          className="inline-flex items-center gap-2 bg-snow text-obsidian px-5 py-2.5 text-sm hover:bg-glacier-light transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новая экспедиция
        </Link>
      </div>

      <div className="border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-mist text-xs uppercase tracking-wide">
              <th className="px-5 py-3 font-normal">Название (RU)</th>
              <th className="px-5 py-3 font-normal">Slug</th>
              <th className="px-5 py-3 font-normal">Уровень</th>
              <th className="px-5 py-3 font-normal">Высота</th>
              <th className="px-5 py-3 font-normal">Статус</th>
              <th className="px-5 py-3 font-normal text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {expeditions.map((exp) => (
              <tr key={exp.id} className="border-b border-white/5 text-snow">
                <td className="px-5 py-3">{exp.titleRu ?? "—"}</td>
                <td className="px-5 py-3 font-mono text-xs text-mist">{exp.slug}</td>
                <td className="px-5 py-3 text-mist">{exp.levelName}</td>
                <td className="px-5 py-3 text-mist">{exp.altitude_m ? `${exp.altitude_m} м` : "—"}</td>
                <td className="px-5 py-3">
                  {exp.is_published ? (
                    <span className="inline-flex items-center gap-1.5 text-glacier-light text-xs">
                      <Eye className="w-3.5 h-3.5" /> Опубликовано
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-mist text-xs">
                      <EyeOff className="w-3.5 h-3.5" /> Черновик
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/expeditions/${exp.id}`} className="text-mist hover:text-glacier-light">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteButton id={exp.id} />
                  </div>
                </td>
              </tr>
            ))}
            {expeditions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-mist">
                  Пока нет ни одной экспедиции.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

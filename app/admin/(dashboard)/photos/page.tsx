import { getExpeditionsList, getExpeditionPhotos } from "./actions";
import PhotoManager, { type PhotoRow } from "./PhotoManager";
import BackToContentHub from "../BackToContentHub";

export default async function PhotosPage() {
  const expeditions = await getExpeditionsList();

  const photosByExpedition: Record<string, PhotoRow[]> = {};
  for (const exp of expeditions) {
    photosByExpedition[exp.id] = (await getExpeditionPhotos(exp.id)) as PhotoRow[];
  }

  return (
    <div>
      <BackToContentHub />
      <h1 className="font-display text-3xl uppercase text-snow tracking-wide mb-4">Фотографии</h1>
      <p className="text-mist text-sm max-w-lg mb-8">
        Фото привязываются к конкретной экспедиции. Первая загруженная фотография становится
        обложкой автоматически — поменять можно звёздочкой на любой фотографии.
      </p>
      {expeditions.length === 0 ? (
        <p className="text-mist text-sm">Сначала создайте хотя бы одну экспедицию.</p>
      ) : (
        <PhotoManager expeditions={expeditions} initialPhotos={photosByExpedition} />
      )}
    </div>
  );
}

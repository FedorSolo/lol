// Shared imperative-handle shapes so every expedition sub-section
// (itinerary, inclusions/exclusions, equipment, updates, the main form)
// can be triggered from ONE "Сохранить всё" button instead of each row
// needing its own Save click.

export interface RowSaveResult {
  ok: boolean;
  error?: string;
}

export interface RowHandle {
  save: () => Promise<RowSaveResult>;
}

export interface ManagerSaveResult {
  ok: boolean;
  errors: string[];
}

export interface ManagerHandle {
  saveAll: () => Promise<ManagerSaveResult>;
}

"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteExpedition } from "./actions";

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Удалить экспедицию безвозвратно?")) return;
    startTransition(() => {
      deleteExpedition(id);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-mist hover:text-red-400 disabled:opacity-50"
      aria-label="Удалить"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

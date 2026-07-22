"use client";

import { useTransition } from "react";
import { updateApplicationStatus } from "./actions";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const STATUSES: ApplicationStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
];

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  NEW: "text-glacier-light",
  CONTACTED: "text-mist",
  INTERVIEW: "text-mist",
  APPROVED: "text-green-400",
  REJECTED: "text-red-400",
  COMPLETED: "text-green-400",
};

export default function StatusSelect({ id, status }: { id: string; status: ApplicationStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => {
          updateApplicationStatus(id, e.target.value as ApplicationStatus);
        })
      }
      className={`bg-transparent border border-white/20 px-2 py-1.5 text-xs outline-none focus:border-glacier-light ${STATUS_COLORS[status]}`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="bg-obsidian text-snow">
          {s}
        </option>
      ))}
    </select>
  );
}

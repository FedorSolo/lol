"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

export async function toggleEquipmentCheck(equipmentId: string, checked: boolean): Promise<ActionResult> {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Не авторизован" };

  const { error } = await supabase
    .from("client_equipment_checks")
    .upsert(
      { client_id: user.id, equipment_id: equipmentId, is_checked: checked },
      { onConflict: "client_id,equipment_id" }
    );
  if (error) return { ok: false, error: error.message };
  revalidatePath("/account/trip");
  return { ok: true };
}

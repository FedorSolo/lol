"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("applications").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/applications");
}

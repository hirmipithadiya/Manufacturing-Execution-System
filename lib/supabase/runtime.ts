import type { SupabaseClient } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export function isSupabaseSchemaError(message?: string | null) {
  if (!message) {
    return false;
  }

  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("schema cache") ||
    normalizedMessage.includes("could not find the table") ||
    normalizedMessage.includes("relation") ||
    normalizedMessage.includes("does not exist")
  );
}

export async function isSupabaseAppReady(supabase: SupabaseClient | null) {
  if (!hasSupabaseEnv || !supabase) {
    return false;
  }

  const { error } = await supabase.from("profiles").select("id").limit(1);
  return !error;
}

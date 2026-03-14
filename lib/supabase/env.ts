export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  "";

const invalidAnonKeyMarkers = [
  "",
  "replace-with-your-real-supabase-anon-key",
  "your-anon-key",
  "your_supabase_anon_key",
];

export const hasSupabaseEnv =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  supabaseUrl !== supabaseAnonKey &&
  !invalidAnonKeyMarkers.includes(supabaseAnonKey);

import type { DataSource } from "@/lib/types";
import { Badge } from "@/components/ui";

export function SourceBadge({ source }: { source: DataSource }) {
  return source === "supabase" ? (
    <Badge tone="emerald">Connected operations</Badge>
  ) : (
    <Badge tone="amber">Preview workspace</Badge>
  );
}

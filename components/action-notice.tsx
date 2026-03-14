import { parsePageNotice, type PageSearchParams } from "@/lib/page-notice";

export function ActionNotice({ searchParams }: { searchParams?: PageSearchParams | null }) {
  const notice = parsePageNotice(searchParams);

  if (!notice) {
    return null;
  }

  return (
    <div
      className={`rounded-[24px] border px-5 py-4 text-sm ${
        notice.tone === "emerald"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : notice.tone === "amber"
            ? "border-amber-200 bg-amber-50 text-amber-700"
            : "border-rose-200 bg-rose-50 text-rose-700"
      }`}
    >
      {notice.message}
    </div>
  );
}

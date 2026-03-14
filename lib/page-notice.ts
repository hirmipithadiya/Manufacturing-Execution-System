export type NoticeTone = "emerald" | "amber" | "rose";
export type PageSearchParams = Record<string, string | string[] | undefined>;
export type PageSearchParamsPromise = Promise<PageSearchParams>;

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePageNotice(searchParams?: PageSearchParams | null) {
  if (!searchParams) {
    return null;
  }

  const tone = getFirstValue(searchParams.noticeTone);
  const message = getFirstValue(searchParams.noticeMessage);

  if (!message) {
    return null;
  }

  if (tone !== "emerald" && tone !== "amber" && tone !== "rose") {
    return null;
  }

  return {
    tone,
    message,
  };
}

export function buildNoticeRedirectPath(
  path: string,
  notice: {
    tone: NoticeTone;
    message: string;
  },
) {
  const url = new URL(path, "http://localhost");
  url.searchParams.set("noticeTone", notice.tone);
  url.searchParams.set("noticeMessage", notice.message);

  return `${url.pathname}${url.search}`;
}

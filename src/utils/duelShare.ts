import { ROUTES } from "@/routes/paths";

export function buildDuelJoinUrl(code: string): string {
  if (typeof window === "undefined") {
    return ROUTES.duelJoin(code);
  }

  return `${window.location.origin}${ROUTES.duelJoin(code)}`;
}

export async function copyDuelJoinLink(code: string): Promise<void> {
  await navigator.clipboard.writeText(buildDuelJoinUrl(code));
}

export async function shareDuelJoinLink(params: {
  code: string;
  deskTitle: string;
}): Promise<"shared" | "copied" | "unsupported"> {
  const url = buildDuelJoinUrl(params.code);
  const shareData = {
    title: "Memora Duel",
    text: `Join my duel on "${params.deskTitle}"`,
    url,
  };

  if (typeof navigator.share === "function") {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "unsupported";
      }
    }
  }

  await copyDuelJoinLink(params.code);
  return "copied";
}

import { QueryClient } from "@tanstack/react-query";
import { CARD_ORIENTATION } from "@/services/desk/desk.const";
import { DEFAULT_DESK_LANGUAGE_SETTINGS } from "@/constants/language.const";
import {
  FetchDeskResponse,
  FetchDesksResponse,
} from "@/services/desk/desk.types";
import { USER_DESK, USER_DESKS } from "@/routes/react-query";

const EMPTY_WEEK = {
  mon: 0,
  tue: 0,
  wed: 0,
  thu: 0,
  fri: 0,
  sat: 0,
  sun: 0,
};

export function deskSummaryToPlaceholder(
  summary: FetchDesksResponse
): FetchDeskResponse {
  return {
    sub: summary.sub,
    title: summary.title,
    description: summary.description,
    created_at: "",
    cards: [],
    settings: {
      cards_per_session: 20,
      card_orientation: CARD_ORIENTATION.NORMAL,
      ...DEFAULT_DESK_LANGUAGE_SETTINGS,
    },
    stats: {
      total_cards: summary.totalCards,
      new_cards: summary.newCards,
      due_today: summary.dueCards,
      mastered_cards: summary.masteredCards,
      avg_ease_factor: 2.5,
      weeklyStats: {
        current: EMPTY_WEEK,
        previous: EMPTY_WEEK,
      },
    },
  };
}

export function getDeskPlaceholder(
  queryClient: QueryClient,
  sub: string
): FetchDeskResponse | undefined {
  const cached = queryClient.getQueryData<FetchDeskResponse>([USER_DESK, sub]);
  if (cached) return cached;

  const desks = queryClient.getQueryData<FetchDesksResponse[]>([USER_DESKS]);
  const summary = desks?.find((d) => d.sub === sub);
  if (!summary) return undefined;

  return deskSummaryToPlaceholder(summary);
}

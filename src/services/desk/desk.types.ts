import { UpdateDeskValues } from "@/schemas/updateDesk.schema";
import { CARD_ORIENTATION } from "./desk.const";

export interface FetchDesksResponse {
  sub: string;
  title: string;
  description: string;
  totalCards: number;
  newCards: number;
  dueCards: number;
  learningCards: number;
  masteredCards: number;
}

export interface FetchDesksShortResponse {
  sub: string;
  title: string;
}

export interface DeskSettings {
  cards_per_session: number;
  card_orientation: CARD_ORIENTATION;
}

export interface FeedSettings {
  card_orientation: CARD_ORIENTATION;
}

export interface FetchDeskResponse {
  sub: string;
  title: string;
  description: string;
  created_at: string;
  cards: {
    sub: string;
    front_variants: string[];
    back_variants: string[];
    examples: string[];
    created_at: string;
  }[];
  settings: DeskSettings;
  stats: {
    total_cards: number;
    new_cards: number;
    due_today: number;
    mastered_cards: number;
    avg_ease_factor: number;
    weeklyStats: {
      current: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
      };
      previous: {
        mon: number;
        tue: number;
        wed: number;
        thu: number;
        fri: number;
        sat: number;
        sun: number;
      };
    };
  };
}

export interface GetCardsToPlayResponse {
  deskSub: string;
  cards: {
    id: number;
    front: string;
    back: string;
    showSide: "front" | "back";
  }[];
}

export interface CreateDeskParams {
  sub: string;
  title: string;
  description: string;
  isPublic: boolean;
}

export interface CreateCardParams {
  desk_sub: string;
  front: string[];
  back: string[];
}

export interface UpdateDeskSettingsParams {
  desk_sub: string;
  settings: DeskSettings;
}

export interface UpdateFeedSettingsParams {
  card_orientation: CARD_ORIENTATION;
}

export interface UpdateDeskParams {
  desk_sub: string;
  payload: UpdateDeskValues;
}

export interface UpdateCardParams {
  card_sub: string;
  payload: {
    front: string[];
    back: string[];
  };
}

export interface DeleteCardParams {
  cardSub: string;
}

export interface ArchiveDeskParams {
  desk_sub: string;
}

export interface CreateDeskResult {
  sub: string;
  title: string;
  description: string;
  public: boolean;
  created_at: string;
}

export interface CreateCardResult {
  id: number;
  sub: string;
  creator_sub: string;
  front_variants: string[];
  back_variants: string[];
  created_at: string;
}

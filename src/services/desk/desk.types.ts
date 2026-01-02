import { UpdateDeskValues } from "@/schemas/updateDesk.schema";
import { CARD_ORIENTATION } from "./desk.const";

export interface FetchDesksResponse {
  sub: string;
  title: string;
  description: string;
  created_at: string;
}

interface Card {
  sub: string;
  front_variants: string[];
  back_variants: string[];
  created_at: string;
}

export interface DeskSettings {
  cards_per_session: number;
  card_orientation: CARD_ORIENTATION;
}

export interface FetchDeskResponse {
  sub: string;
  title: string;
  description: string;
  created_at: string;
  cards: Card[];
  settings: DeskSettings;
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

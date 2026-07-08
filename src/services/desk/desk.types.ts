import { UpdateDeskValues } from "@/schemas/updateDesk.schema";
import { CARD_ORIENTATION } from "./desk.const";
import { LanguageCode } from "@/constants/language.const";
import { StudyMode } from "@/constants/studyMode.const";

export interface FetchDesksResponse {
  sub: string;
  title: string;
  description: string;
  totalCards: number;
  newCards: number;
  dueCards: number;
  learningCards: number;
  masteredCards: number;
  sourceCreatorNickname?: string;
}

export interface FetchArchivedDesksResponse {
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
  folderSub: string | null;
}

export interface DeskSettings {
  cards_per_session: number;
  card_orientation: CARD_ORIENTATION;
  front_language: LanguageCode;
  back_language: LanguageCode;
  example_language: LanguageCode;
  study_mode: StudyMode;
}

export interface FeedSettings {
  card_orientation: CARD_ORIENTATION;
  study_mode: StudyMode;
}

export interface FetchDeskResponse {
  sub: string;
  title: string;
  description: string;
  visibility: "private" | "public" | "friends" | "unlisted";
  created_at: string;
  cards: {
    sub: string;
    front_variants: string[];
    back_variants: string[];
    examples: string[];
    created_at: string;
    image_url?: string | null;
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

export interface FetchCardResponse {
  sub: string;
  created_at: string;
  front_variants: string[];
  back_variants: string[];
  examples: string[];
  image_url?: string | null;
}

export interface RootFolder {
  sub: string;
  title: string;
  description: string;
  deskCount: number;
  folderCount: number;
}

export interface FolderFlat {
  sub: string;
  title: string;
  parentFolderSub: string | null;
}

export interface FetchDeskCardsResponse {
  sub: string;
  createdAt: string;
  frontVariants: string[];
  backVariants: string[];
  examples: string[];
  image_url?: string | null;
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
  visibility: "private" | "public" | "friends" | "unlisted";
  folder_sub: string | null;
  front_language: LanguageCode;
  back_language: LanguageCode;
  example_language: LanguageCode;
}

export interface CreateCardParams {
  desk_sub: string;
  front: string[];
  back: string[];
  examples?: string[];
}

export interface UpdateDeskSettingsParams {
  desk_sub: string;
  settings: DeskSettings;
}

export interface UpdateReviewSettingsParams {
  cards_per_session: number;
  study_mode: StudyMode;
}

export interface UpdateFeedSettingsParams {
  card_orientation: CARD_ORIENTATION;
  study_mode: StudyMode;
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
  visibility: "private" | "public" | "friends" | "unlisted";
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

export interface GetPublicDeskResponse {
  sub: string;
  title: string;
  description: string;
  creatorNickname: string;
  cardCount: number;
  cards: {
    sub: string;
    frontVariants: string[];
  }[];
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface AddToLibraryResponse {
  sub: string;
  localDeskSub: string;
  sourceDeskSub: string;
  title: string;
  cardCount: number;
}

export interface LibrarySource {
  sub: string;
  sourceDeskSub: string;
  localDeskSub: string;
  sourceCreatorSub: string;
  sourceCreatorNickname: string;
  sourceDeskTitle: string;
  localDeskTitle: string;
  mode: string;
  createdAt: string;
}

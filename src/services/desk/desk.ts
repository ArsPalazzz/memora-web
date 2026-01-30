import {
  ArchiveDeskParams,
  CreateCardParams,
  CreateCardResult,
  CreateDeskParams,
  CreateDeskResult,
  DeleteCardParams,
  FetchArchivedDesksResponse,
  FetchCardResponse,
  FetchDeskCardsResponse,
  FetchDeskResponse,
  FetchDesksResponse,
  FetchDesksShortResponse,
  FolderTree,
  GetCardsToPlayResponse,
  UpdateCardParams,
  UpdateDeskParams,
  UpdateDeskSettingsParams,
  UpdateFeedSettingsParams,
} from "./desk.types";
import { api, handleApiRequest } from "@/lib/axios";
import {
  ARCHIVE_DESK_API,
  CREATE_CARD_API,
  CREATE_DESK_API,
  DELETE_CARD_API,
  FETCH_ARCHIVED_DESKS_API,
  FETCH_CARD_API,
  FETCH_CARDS_TO_PLAY_API,
  FETCH_DESK_API,
  FETCH_DESK_CARDS_API,
  FETCH_DESKS_API,
  FETCH_DESKS_SHORT_API,
  RESTORE_DESK_API,
  UPDATE_CARD_API,
  UPDATE_DESK_API,
  UPDATE_DESK_SETTINGS_API,
  UPDATE_FEED_SETTINGS_API,
} from "@/routes/api";

export async function fetchMyDesksRequest(
  token: string
): Promise<FetchDesksResponse[]> {
  return handleApiRequest(
    api.get(FETCH_DESKS_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function fetchMyArchivedDesksRequest(
  token: string
): Promise<FetchArchivedDesksResponse[]> {
  return handleApiRequest(
    api.get(FETCH_ARCHIVED_DESKS_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function fetchMyDesksShortRequest(
  token: string
): Promise<FetchDesksShortResponse[]> {
  return handleApiRequest(
    api.get(FETCH_DESKS_SHORT_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function fetchDeskRequest(
  sub: string,
  token: string
): Promise<FetchDeskResponse> {
  return handleApiRequest(
    api.get(FETCH_DESK_API(sub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function fetchCardRequest(
  sub: string,
  token: string
): Promise<FetchCardResponse> {
  return handleApiRequest(
    api.get(FETCH_CARD_API(sub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export const getFoldersRequest = async (
  token: string
): Promise<FolderTree[]> => {
  return handleApiRequest(
    api.get("/folders", {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export const createFolderRequest = async (
  data: {
    title: string;
    description: string;
    parent_folder_sub?: string | null;
  },
  token: string
): Promise<void> => {
  return handleApiRequest(
    api.post("/folders", data, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};

export async function fetchDeskCardsRequest(
  sub: string,
  token: string
): Promise<FetchDeskCardsResponse[]> {
  return handleApiRequest(
    api.get(FETCH_DESK_CARDS_API(sub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getCardsToPlayRequest(
  sub: string,
  token: string
): Promise<GetCardsToPlayResponse> {
  return handleApiRequest(
    api.post(
      FETCH_CARDS_TO_PLAY_API(sub),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}

export async function addCardToDeskFeedRequest(
  token: string,
  payload: { cardSub: string; deskSubs: string[] }
): Promise<FetchDesksShortResponse[]> {
  return handleApiRequest(
    api.post("/games/add-to-desk", payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function createDeskRequest(
  payload: CreateDeskParams,
  token: string
): Promise<CreateDeskResult> {
  return handleApiRequest(
    api.post(CREATE_DESK_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function createCardRequest(
  payload: CreateCardParams,
  token: string
): Promise<CreateCardResult> {
  return handleApiRequest(
    api.post(CREATE_CARD_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function updateDeskSettingsRequest(
  payload: UpdateDeskSettingsParams,
  token: string
): Promise<{ updated: boolean }> {
  return handleApiRequest(
    api.put(UPDATE_DESK_SETTINGS_API(payload.desk_sub), payload.settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function updateFeedSettingsRequest(
  payload: UpdateFeedSettingsParams,
  token: string
): Promise<{ updated: boolean }> {
  return handleApiRequest(
    api.put(UPDATE_FEED_SETTINGS_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function updateDeskRequest(
  payload: UpdateDeskParams,
  token: string
): Promise<{ updated: boolean }> {
  return handleApiRequest(
    api.put(UPDATE_DESK_API(payload.desk_sub), payload.payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function updateCardRequest(
  payload: UpdateCardParams,
  token: string
): Promise<{ updated: boolean }> {
  return handleApiRequest(
    api.put(UPDATE_CARD_API(payload.card_sub), payload.payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function deleteCardRequest(
  payload: DeleteCardParams,
  token: string
): Promise<{ archived: boolean }> {
  return handleApiRequest(
    api.delete(DELETE_CARD_API(payload.cardSub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function archiveDeskRequest(
  payload: ArchiveDeskParams,
  token: string
): Promise<{ archived: boolean }> {
  return handleApiRequest(
    api.delete(ARCHIVE_DESK_API(payload.desk_sub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function restoreDeskRequest(
  payload: ArchiveDeskParams,
  token: string
) {
  return handleApiRequest(
    api.put(
      RESTORE_DESK_API(payload.desk_sub),
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
  );
}

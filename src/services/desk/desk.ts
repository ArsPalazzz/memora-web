import {
  ArchiveDeskParams,
  CreateCardParams,
  CreateCardResult,
  CreateDeskParams,
  CreateDeskResult,
  FetchDeskResponse,
  FetchDesksResponse,
  GetCardsToPlayResponse,
  UpdateCardParams,
  UpdateDeskParams,
  UpdateDeskSettingsParams,
} from "./desk.types";
import { api, handleApiRequest } from "@/lib/axios";
import {
  ARCHIVE_DESK_API,
  CREATE_CARD_API,
  CREATE_DESK_API,
  FETCH_CARDS_TO_PLAY_API,
  FETCH_DESK_API,
  FETCH_DESKS_API,
  UPDATE_CARD_API,
  UPDATE_DESK_API,
  UPDATE_DESK_SETTINGS_API,
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

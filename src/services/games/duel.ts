import { api, handleApiRequest } from "@/lib/axios";
import {
  ADD_DUEL_WRONG_CARDS_TO_INBOX_API,
  CREATE_DUEL_API,
  FORFEIT_DUEL_RACE_API,
  GET_DUEL_API,
  GET_DUEL_HEAD_TO_HEAD_STATS_API,
  GET_DUEL_HISTORY_API,
  GET_DUEL_RACE_PAYLOAD_API,
  GET_DUEL_RESULTS_API,
  JOIN_DUEL_API,
} from "@/routes/api";
import type {
  DuelConfig,
  DuelHeadToHeadStats,
  DuelHistoryEntry,
  DuelRaceFinishedResults,
  DuelRacePayload,
  DuelResponse,
} from "@/services/games/duel.types";

export async function createDuelRequest(
  params: {
    deskSub: string;
    inviteFriendSub?: string;
    config?: Partial<DuelConfig>;
  },
  token: string
): Promise<{ duel: DuelResponse }> {
  return handleApiRequest(
    api.post(
      CREATE_DUEL_API,
      params,
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function joinDuelRequest(
  code: string,
  token: string
): Promise<{ duel: DuelResponse }> {
  return handleApiRequest(
    api.post(
      JOIN_DUEL_API(code),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function getDuelRequest(
  duelId: string,
  token: string
): Promise<{ duel: DuelResponse }> {
  return handleApiRequest(
    api.get(GET_DUEL_API(duelId), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getDuelRacePayloadRequest(
  duelId: string,
  token: string
): Promise<{ payload: DuelRacePayload }> {
  return handleApiRequest(
    api.get(GET_DUEL_RACE_PAYLOAD_API(duelId), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getDuelResultsRequest(
  duelId: string,
  token: string
): Promise<{ results: DuelRaceFinishedResults }> {
  return handleApiRequest(
    api.get(GET_DUEL_RESULTS_API(duelId), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getDuelHeadToHeadStatsRequest(
  friendSub: string,
  token: string
): Promise<{ stats: DuelHeadToHeadStats }> {
  return handleApiRequest(
    api.get(GET_DUEL_HEAD_TO_HEAD_STATS_API(friendSub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getDuelHistoryRequest(
  token: string,
  limit = 20
): Promise<{ history: DuelHistoryEntry[] }> {
  return handleApiRequest(
    api.get(GET_DUEL_HISTORY_API, {
      params: { limit },
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function addDuelWrongCardsToInboxRequest(
  duelId: string,
  token: string
): Promise<{ added: number; skipped: number }> {
  return handleApiRequest(
    api.post(
      ADD_DUEL_WRONG_CARDS_TO_INBOX_API(duelId),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function leaveDuelRequest(
  duelId: string,
  token: string
): Promise<{ duel: DuelResponse }> {
  return handleApiRequest(
    api.delete(GET_DUEL_API(duelId), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function forfeitDuelRaceRequest(
  duelId: string,
  token: string
): Promise<{ results: DuelRaceFinishedResults }> {
  return handleApiRequest(
    api.post(
      FORFEIT_DUEL_RACE_API(duelId),
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

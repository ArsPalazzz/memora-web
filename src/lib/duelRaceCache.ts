import type {
  DuelRaceFinishedResults,
  DuelRacePayload,
} from '@/services/games/duel.types';

const PAYLOAD_PREFIX = 'duel_race_payload:';
const RESULTS_PREFIX = 'duel_race_results:';

function payloadKey(duelId: string): string {
  return `${PAYLOAD_PREFIX}${duelId}`;
}

function resultsKey(duelId: string): string {
  return `${RESULTS_PREFIX}${duelId}`;
}

export function loadRacePayload(duelId: string): DuelRacePayload | null {
  try {
    const raw = sessionStorage.getItem(payloadKey(duelId));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as DuelRacePayload;
  } catch {
    return null;
  }
}

export function saveRacePayload(duelId: string, payload: DuelRacePayload): void {
  sessionStorage.setItem(payloadKey(duelId), JSON.stringify(payload));
}

export function clearRacePayload(duelId: string): void {
  sessionStorage.removeItem(payloadKey(duelId));
}

export function saveRaceResults(
  duelId: string,
  results: DuelRaceFinishedResults
): void {
  sessionStorage.setItem(resultsKey(duelId), JSON.stringify(results));
}

export function loadRaceResults(duelId: string): DuelRaceFinishedResults | null {
  try {
    const raw = sessionStorage.getItem(resultsKey(duelId));
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as DuelRaceFinishedResults;
  } catch {
    return null;
  }
}

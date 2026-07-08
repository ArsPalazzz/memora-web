import { io, Socket } from 'socket.io-client';
import { getAccessToken, subscribeAccessToken } from '@/auth/tokenStore';
import type {
  DuelClientToServerEvents,
  DuelJoinPayload,
  DuelRaceAdvancePayload,
  DuelRaceFinishedResults,
  DuelRaceForfeitPayload,
  DuelRaceGradedPayload,
  DuelRacePayload,
  DuelRaceProgress,
  DuelRaceRejoinPayload,
  DuelRaceRejoinState,
  DuelReadyPayload,
  DuelResponse,
  DuelServerToClientEvents,
  DuelStartPayload,
  DuelUpdateConfigPayload,
} from '@/services/games/duel.types';

const DUEL_ID_STORAGE_KEY = 'duel_last_id';

type DuelSocket = Socket<DuelServerToClientEvents, DuelClientToServerEvents>;

let socket: DuelSocket | null = null;
let connectPromise: Promise<DuelSocket> | null = null;
let tokenUnsubscribe: (() => void) | null = null;

const lobbyStateListeners = new Set<(state: DuelResponse) => void>();
const lobbyErrorListeners = new Set<(message: string) => void>();
const connectionListeners = new Set<(connected: boolean) => void>();
const raceStartedListeners = new Set<(payload: DuelRacePayload) => void>();
const raceProgressListeners = new Set<(progress: DuelRaceProgress) => void>();
const raceGradedListeners = new Set<(graded: DuelRaceGradedPayload) => void>();
const raceFinishedListeners = new Set<(results: DuelRaceFinishedResults) => void>();
const raceRejoinStateListeners = new Set<(state: DuelRaceRejoinState) => void>();
const raceErrorListeners = new Set<(message: string) => void>();

function getSocketOrigin(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // Dev: Vite proxies /socket.io → backend. Prod: connect directly to Railway
  // (Vercel Edge only proxies /api/* and cannot upgrade WebSockets).
  if (import.meta.env.DEV) {
    return window.location.origin;
  }

  const backendUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
  return backendUrl || window.location.origin;
}

function notifyConnection(connected: boolean) {
  connectionListeners.forEach((listener) => listener(connected));
}

function attachSocketListeners(nextSocket: DuelSocket) {
  nextSocket.off('lobby:state');
  nextSocket.off('lobby:error');
  nextSocket.off('race:started');
  nextSocket.off('race:progress');
  nextSocket.off('race:graded');
  nextSocket.off('race:finished');
  nextSocket.off('race:rejoin-state');
  nextSocket.off('race:error');
  nextSocket.off('connect');
  nextSocket.off('disconnect');

  nextSocket.on('lobby:state', (state) => {
    lobbyStateListeners.forEach((listener) => listener(state));
  });

  nextSocket.on('lobby:error', ({ message }) => {
    lobbyErrorListeners.forEach((listener) => listener(message));
  });

  nextSocket.on('race:started', (payload) => {
    raceStartedListeners.forEach((listener) => listener(payload));
  });

  nextSocket.on('race:progress', (progress) => {
    raceProgressListeners.forEach((listener) => listener(progress));
  });

  nextSocket.on('race:graded', (graded) => {
    raceGradedListeners.forEach((listener) => listener(graded));
  });

  nextSocket.on('race:finished', ({ results }) => {
    raceFinishedListeners.forEach((listener) => listener(results));
  });

  nextSocket.on('race:rejoin-state', (state) => {
    raceRejoinStateListeners.forEach((listener) => listener(state));
  });

  nextSocket.on('race:error', ({ message }) => {
    raceErrorListeners.forEach((listener) => listener(message));
  });

  nextSocket.on('connect', () => {
    notifyConnection(true);

    const lastDuelId = sessionStorage.getItem(DUEL_ID_STORAGE_KEY);
    if (lastDuelId) {
      nextSocket.emit('lobby:join', { duelId: lastDuelId });
    }
  });

  nextSocket.on('disconnect', () => {
    notifyConnection(false);
  });
}

function ensureTokenSubscription() {
  if (tokenUnsubscribe) {
    return;
  }

  tokenUnsubscribe = subscribeAccessToken((token) => {
    if (!token) {
      disconnectDuelSocket();
      return;
    }

    if (socket) {
      socket.auth = { token };
      if (!socket.connected) {
        socket.connect();
      }
    }
  });
}

export function getDuelSocket(): DuelSocket | null {
  return socket;
}

export function rememberDuelId(duelId: string): void {
  sessionStorage.setItem(DUEL_ID_STORAGE_KEY, duelId);
}

export function clearRememberedDuelId(): void {
  sessionStorage.removeItem(DUEL_ID_STORAGE_KEY);
}

export function connectDuelSocket(): Promise<DuelSocket> {
  if (socket?.connected) {
    return Promise.resolve(socket);
  }

  if (connectPromise) {
    return connectPromise;
  }

  const token = getAccessToken();
  if (!token) {
    return Promise.reject(new Error('Not authenticated'));
  }

  connectPromise = new Promise<DuelSocket>((resolve, reject) => {
    const nextSocket: DuelSocket = io(`${getSocketOrigin()}/duels`, {
      path: '/socket.io',
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling'],
    });

    const handleConnect = () => {
      cleanup();
      socket = nextSocket;
      attachSocketListeners(nextSocket);
      ensureTokenSubscription();
      notifyConnection(true);
      resolve(nextSocket);
    };

    const handleConnectError = (error: Error) => {
      cleanup();
      notifyConnection(false);
      reject(error);
    };

    const cleanup = () => {
      nextSocket.off('connect', handleConnect);
      nextSocket.off('connect_error', handleConnectError);
    };

    nextSocket.on('connect', handleConnect);
    nextSocket.on('connect_error', handleConnectError);
  }).finally(() => {
    connectPromise = null;
  });

  return connectPromise;
}

export async function joinDuelLobby(duelId: string): Promise<DuelSocket> {
  rememberDuelId(duelId);
  const nextSocket = await connectDuelSocket();
  nextSocket.emit('lobby:join', { duelId });
  return nextSocket;
}

export function setDuelReady(payload: DuelReadyPayload): void {
  socket?.emit('lobby:ready', payload);
}

export function updateDuelConfig(payload: DuelUpdateConfigPayload): void {
  socket?.emit('lobby:update-config', payload);
}

export function startDuelLobby(payload: DuelStartPayload): void {
  socket?.emit('lobby:start', payload);
}

export function leaveDuelLobbyRoom(duelId: string): void {
  socket?.emit('lobby:leave', { duelId });
}

export function advanceDuelRace(payload: DuelRaceAdvancePayload): void {
  socket?.emit('race:advance', payload);
}

export function forfeitDuelRace(payload: DuelRaceForfeitPayload): void {
  socket?.emit('race:forfeit', payload);
}

export function rejoinDuelRace(payload: DuelRaceRejoinPayload): void {
  socket?.emit('race:rejoin', payload);
}

export function subscribeDuelLobbyState(
  listener: (state: DuelResponse) => void
): () => void {
  lobbyStateListeners.add(listener);
  return () => lobbyStateListeners.delete(listener);
}

export function subscribeDuelLobbyError(
  listener: (message: string) => void
): () => void {
  lobbyErrorListeners.add(listener);
  return () => lobbyErrorListeners.delete(listener);
}

export function subscribeDuelSocketConnection(
  listener: (connected: boolean) => void
): () => void {
  connectionListeners.add(listener);
  listener(Boolean(socket?.connected));
  return () => connectionListeners.delete(listener);
}

export function subscribeRaceStarted(
  listener: (payload: DuelRacePayload) => void
): () => void {
  raceStartedListeners.add(listener);
  return () => raceStartedListeners.delete(listener);
}

export function subscribeRaceProgress(
  listener: (progress: DuelRaceProgress) => void
): () => void {
  raceProgressListeners.add(listener);
  return () => raceProgressListeners.delete(listener);
}

export function subscribeRaceGraded(
  listener: (graded: DuelRaceGradedPayload) => void
): () => void {
  raceGradedListeners.add(listener);
  return () => raceGradedListeners.delete(listener);
}

export function subscribeRaceFinished(
  listener: (results: DuelRaceFinishedResults) => void
): () => void {
  raceFinishedListeners.add(listener);
  return () => raceFinishedListeners.delete(listener);
}

export function subscribeRaceRejoinState(
  listener: (state: DuelRaceRejoinState) => void
): () => void {
  raceRejoinStateListeners.add(listener);
  return () => raceRejoinStateListeners.delete(listener);
}

export function subscribeRaceError(
  listener: (message: string) => void
): () => void {
  raceErrorListeners.add(listener);
  return () => raceErrorListeners.delete(listener);
}

export function disconnectDuelSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  connectPromise = null;
  notifyConnection(false);
}

export function leaveDuelLobby(): void {
  clearRememberedDuelId();
  disconnectDuelSocket();
}

export async function leaveDuelLobbyAndRoom(duelId: string): Promise<void> {
  leaveDuelLobbyRoom(duelId);
  clearRememberedDuelId();
}

export type { DuelJoinPayload };

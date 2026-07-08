export const ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/sign-up",
  HOME: "/home",
  PROFILE: "/profile",
  FEED: "/feed",
  addFriendInvite: (nickname: string) =>
    `/add?u=${encodeURIComponent(nickname)}`,
  loginWithRedirect: (redirectPath: string) =>
    `/login?redirect=${encodeURIComponent(redirectPath)}`,
  userProfile: (nickname: string) => `/u/${encodeURIComponent(nickname)}`,
  publicDesk: (nickname: string, deskSub: string) =>
    `/u/${encodeURIComponent(nickname)}/desk/${encodeURIComponent(deskSub)}`,
  publicDeskBySub: (deskSub: string) =>
    `/desk/${encodeURIComponent(deskSub)}/public`,
  FRIENDS_LEAGUE: "/friends/league",
  FRIENDS: "/friends",
  duelJoin: (code: string) => `/duel/join/${encodeURIComponent(code.toUpperCase())}`,
  duelLobby: (duelId: string) => `/duel/lobby/${encodeURIComponent(duelId)}`,
  duelRace: (duelId: string) => `/duel/race/${encodeURIComponent(duelId)}`,
  duelResults: (duelId: string) => `/duel/results/${encodeURIComponent(duelId)}`,
};

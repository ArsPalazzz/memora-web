// AUTH
export const SIGN_IN_API = "/auth/sign-in";
export const IS_AUTHENTICATED_API = "/auth/me";
export const REFRESH_API = "/auth/refresh";
export const LOGOUT_API = "/auth/logout";

// USERS
export const CREATE_USER_API = "/users/create";
export const GET_MY_PROFILE_API = "/users/my-profile";
export const GET_USER_DAILY_API = "/users/daily";

// CARDS
export const FETCH_DESKS_API = "/desks";
export const FETCH_ARCHIVED_DESKS_API = "/desks/archived";
export const FETCH_DESKS_SHORT_API = "/desks/short";
export const CREATE_DESK_API = "/desks/create";
export const UPDATE_FEED_SETTINGS_API = "/feed/settings";
export const FETCH_CARD_API = (sub: string) => `/cards/${sub}`;
export const FETCH_DESK_API = (sub: string) => `/desks/${sub}`;
export const FETCH_DESK_CARDS_API = (sub: string) => `/desks/${sub}/cards`;
export const FETCH_CARDS_TO_PLAY_API = (sub: string) => `/desks/${sub}/play`;
export const CREATE_CARD_API = "/cards/create";
export const UPDATE_DESK_API = (sub: string) => `/desks/${sub}`;
export const UPDATE_CARD_API = (sub: string) => `/cards/${sub}`;
export const DELETE_CARD_API = (sub: string) => `/cards/${sub}`;
export const ARCHIVE_DESK_API = (sub: string) => `/desks/${sub}`;
export const RESTORE_DESK_API = (sub: string) => `/desks/${sub}/restore`;
export const UPDATE_DESK_SETTINGS_API = (sub: string) =>
  `/desks/${sub}/settings`;
export const UPDATE_REVIEW_SETTINGS_API = "/review/settings";

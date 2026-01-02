// AUTH
export const SIGN_IN_API = "/auth/sign-in";
export const IS_AUTHENTICATED_API = "/auth/me";
export const REFRESH_API = "/auth/refresh";
export const LOGOUT_API = "/auth/logout";

// USERS
export const CREATE_USER_API = "/users/create";
export const GET_MY_PROFILE_API = "/users/my-profile";

// CARDS
export const FETCH_DESKS_API = "/desks";
export const CREATE_DESK_API = "/desks/create";
export const FETCH_DESK_API = (sub: string) => `/desks/${sub}`;
export const FETCH_CARDS_TO_PLAY_API = (sub: string) => `/desks/${sub}/play`;
export const CREATE_CARD_API = "/cards/create";
export const UPDATE_DESK_API = (sub: string) => `/desks/${sub}`;
export const UPDATE_CARD_API = (sub: string) => `/cards/${sub}`;
export const DELETE_CARD_API = (sub: string) => `/cards/${sub}`;
export const ARCHIVE_DESK_API = (sub: string) => `/desks/${sub}`;
export const UPDATE_DESK_SETTINGS_API = (sub: string) =>
  `/desks/${sub}/settings`;

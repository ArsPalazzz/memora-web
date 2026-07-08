// AUTH
export const SIGN_IN_API = "/auth/sign-in";
export const IS_AUTHENTICATED_API = "/auth/me";
export const REFRESH_API = "/auth/refresh";
export const LOGOUT_API = "/auth/logout";

// USERS
export const CREATE_USER_API = "/users/create";
export const GET_MY_PROFILE_API = "/users/my-profile";
export const SEARCH_USERS_API = "/users/search";
export const PATCH_MY_PROFILE_API = "/users/my-profile";
export const UPLOAD_AVATAR_API = "/users/me/avatar";
export const DELETE_AVATAR_API = "/users/me/avatar";
export const GET_USER_DAILY_API = "/users/daily";
export const GET_REVIEW_SUMMARY_API = "/users/review-summary";
export const GET_INBOX_SUMMARY_API = "/users/inbox-summary";
export const START_REVIEW_API = "/reviews/start";
export const getPublicProfileApi = (nickname: string) =>
  `/users/${encodeURIComponent(nickname)}/public`;

export const FRIENDS_REQUEST_API = "/friends/request";
export const FRIENDS_ACCEPT_API = "/friends/accept";
export const FRIENDS_DECLINE_API = "/friends/decline";
export const FRIENDS_LIST_API = "/friends";
export const FRIENDS_REQUESTS_API = "/friends/requests";
export const FRIENDS_ACTIVITY_API = "/friends/activity";
export const FRIENDS_LEAGUE_API = "/friends/league";
export const getFriendshipStatusApi = (nickname: string) =>
  `/friends/status/${encodeURIComponent(nickname)}`;
export const removeFriendApi = (friendSub: string) =>
  `/friends/${encodeURIComponent(friendSub)}`;

// CARDS
export const FETCH_DESKS_API = "/desks";
export const FETCH_ARCHIVED_DESKS_API = "/desks/archived";
export const FETCH_DESKS_SHORT_API = "/desks/short";
export const GET_LIBRARY_SOURCES_API = "/me/library/sources";
export const addDeskToLibraryApi = (sub: string) =>
  `/desks/${encodeURIComponent(sub)}/add-to-library`;
export const CREATE_DESK_API = "/desks/create";
export const UPDATE_FEED_SETTINGS_API = "/feed/settings";
export const FETCH_CARD_API = (sub: string) => `/cards/${sub}`;
export const FETCH_DESK_API = (sub: string) => `/desks/${sub}`;
export const getPublicDeskApi = (sub: string) => `/desks/${encodeURIComponent(sub)}/public`;
export const FETCH_DESK_CARDS_API = (sub: string) => `/desks/${sub}/cards`;
export const FETCH_CARDS_TO_PLAY_API = (sub: string) => `/desks/${sub}/play`;
export const CREATE_CARD_API = "/cards/create";
export const UPDATE_DESK_API = (sub: string) => `/desks/${sub}`;
export const UPDATE_CARD_API = (sub: string) => `/cards/${sub}`;
export const UPLOAD_CARD_IMAGE_API = (sub: string) => `/cards/${sub}/image`;
export const DELETE_CARD_IMAGE_API = (sub: string) => `/cards/${sub}/image`;
export const REGENERATE_CARD_EXAMPLES_API = (sub: string) =>
  `/cards/${sub}/regenerate-examples`;
export const DELETE_CARD_API = (sub: string) => `/cards/${sub}`;
export const ARCHIVE_DESK_API = (sub: string) => `/desks/${sub}`;
export const RESTORE_DESK_API = (sub: string) => `/desks/${sub}/restore`;
export const UPDATE_DESK_SETTINGS_API = (sub: string) =>
  `/desks/${sub}/settings`;
export const UPDATE_REVIEW_SETTINGS_API = "/review/settings";

// IMPORT
export const ANKI_IMPORT_PREVIEW_API = "/import/anki/preview";
export const ANKI_IMPORT_CREATE_JOB_API = "/import/anki/jobs";
export const ANKI_IMPORT_GET_JOB_API = (sub: string) => `/import/anki/jobs/${sub}`;

// GAMES
export const FINISH_GAME_API = "/games/finish";
export const ADD_TO_INBOX_API = "/games/add-to-inbox";

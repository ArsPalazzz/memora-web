import {
  GetMyProfileResponse,
  GetUserDailyResponse,
  SignUpParams,
  SignUpResponse,
} from "./user.types";
import { api, handleApiRequest } from "@/lib/axios";
import {
  CREATE_USER_API,
  GET_MY_PROFILE_API,
  GET_USER_DAILY_API,
  PATCH_MY_PROFILE_API,
  SEARCH_USERS_API,
  getPublicProfileApi,
} from "@/routes/api";
import { GetPublicProfileResponse } from "./user.types";
import { FriendSummary } from "@/services/friends/friends.types";

export async function signUpRequest(
  payload: SignUpParams
): Promise<SignUpResponse> {
  return handleApiRequest(api.post(CREATE_USER_API, payload));
}

export async function searchUsersByNicknameRequest(
  query: string,
  token: string
): Promise<FriendSummary[]> {
  return handleApiRequest(
    api.get(SEARCH_USERS_API, {
      params: { q: query },
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getMyProfileRequest(
  token: string
): Promise<GetMyProfileResponse> {
  return handleApiRequest(
    api.get(GET_MY_PROFILE_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function updateMyProfileRequest(
  payload: { stats_public?: boolean; league_notifications?: boolean },
  token: string
): Promise<{ profile: GetMyProfileResponse["profile"] }> {
  return handleApiRequest(
    api.patch(PATCH_MY_PROFILE_API, payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getUserDailyRequest(
  token: string
): Promise<GetUserDailyResponse> {
  return handleApiRequest(
    api.get(GET_USER_DAILY_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getPublicProfileRequest(
  nickname: string,
  token: string
): Promise<GetPublicProfileResponse> {
  return handleApiRequest(
    api.get(getPublicProfileApi(nickname), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

import {
  GetMyProfileResponse,
  SignUpParams,
  SignUpResponse,
} from "./user.types";
import { api, handleApiRequest } from "@/lib/axios";
import { CREATE_USER_API, GET_MY_PROFILE_API } from "@/routes/api";

export async function signUpRequest(
  payload: SignUpParams
): Promise<SignUpResponse> {
  return handleApiRequest(api.post(CREATE_USER_API, payload));
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

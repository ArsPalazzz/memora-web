import { api, handleApiRequest } from "@/lib/axios";
import {
  IsAuthenticatedResponse,
  LoginParams,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
} from "./auth.types";
import {
  IS_AUTHENTICATED_API,
  LOGOUT_API,
  REFRESH_API,
  SIGN_IN_API,
} from "@/routes/api";

export async function loginRequest(
  payload: LoginParams
): Promise<LoginResponse> {
  return handleApiRequest(api.post(SIGN_IN_API, payload));
}

export async function refreshRequest(): Promise<RefreshResponse> {
  return handleApiRequest(api.post(REFRESH_API));
}

export async function isAuthenticatedRequest(): Promise<IsAuthenticatedResponse> {
  return handleApiRequest(api.get(IS_AUTHENTICATED_API));
}

export async function logoutRequest(token: string): Promise<LogoutResponse> {
  return handleApiRequest(
    api.post(LOGOUT_API, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

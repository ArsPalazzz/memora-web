export interface LoginParams {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface IsAuthenticatedResponse {
  sub: string;
  authenticated: boolean;
}

export interface LogoutResponse {
  message: string;
}

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  isAuthRequestUrl,
  refreshAccessToken,
} from "@/auth/tokenStore";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && !isAuthRequestUrl(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      !config ||
      config._retry ||
      error.response?.status !== 401 ||
      isAuthRequestUrl(config.url)
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const token = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${token}`;
      return api(config);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export async function handleApiRequest<T>(
  promise: Promise<{ data: T }>
): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message;
      const status = error.response?.status;
      throw new Error(backendMessage || `Request failed (${status})`);
    }

    throw new Error("Unknown error occurred");
  }
}

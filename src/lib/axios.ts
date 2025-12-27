import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

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
    } else {
      throw new Error("Unknown error occurred");
    }
  }
}

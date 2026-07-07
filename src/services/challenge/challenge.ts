import { api, handleApiRequest } from "@/lib/axios";
import { CURRENT_CHALLENGE_API } from "@/routes/api";
import { CurrentChallengeResponse } from "./challenge.types";

export async function getCurrentChallengeRequest(
  token: string
): Promise<CurrentChallengeResponse> {
  return handleApiRequest(
    api.get(CURRENT_CHALLENGE_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

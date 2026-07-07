import { api, handleApiRequest } from "@/lib/axios";
import {
  FRIENDS_ACCEPT_API,
  FRIENDS_ACTIVITY_API,
  FRIENDS_DECLINE_API,
  FRIENDS_LEAGUE_API,
  FRIENDS_LIST_API,
  FRIENDS_REQUEST_API,
  getFriendshipStatusApi,
  removeFriendApi,
} from "@/routes/api";
import {
  FriendActivity,
  FriendSummary,
  FriendshipRelationship,
  SendFriendRequestResponse,
  WeeklyLeagueResponse,
} from "./friends.types";

export async function sendFriendRequest(
  nickname: string,
  token: string
): Promise<SendFriendRequestResponse> {
  return handleApiRequest(
    api.post(
      FRIENDS_REQUEST_API,
      { nickname },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function acceptFriendRequest(
  requesterSub: string,
  token: string
): Promise<{ requesterSub: string; status: "accepted" }> {
  return handleApiRequest(
    api.post(
      FRIENDS_ACCEPT_API,
      { requesterSub },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function declineFriendRequest(
  requesterSub: string,
  token: string
): Promise<{ declined: boolean }> {
  return handleApiRequest(
    api.post(
      FRIENDS_DECLINE_API,
      { requesterSub },
      { headers: { Authorization: `Bearer ${token}` } }
    )
  );
}

export async function getFriendsRequest(token: string): Promise<FriendSummary[]> {
  return handleApiRequest(
    api.get(FRIENDS_LIST_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getFriendsActivityRequest(
  token: string
): Promise<FriendActivity[]> {
  return handleApiRequest(
    api.get(FRIENDS_ACTIVITY_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getFriendsLeagueRequest(
  token: string
): Promise<WeeklyLeagueResponse> {
  return handleApiRequest(
    api.get(FRIENDS_LEAGUE_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function getFriendshipStatusRequest(
  nickname: string,
  token: string
): Promise<FriendshipRelationship> {
  return handleApiRequest(
    api.get(getFriendshipStatusApi(nickname), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

export async function removeFriendRequest(
  friendSub: string,
  token: string
): Promise<{ removed: boolean }> {
  return handleApiRequest(
    api.delete(removeFriendApi(friendSub), {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
}

import { Stack } from "@mui/material";
import { FriendActivity, WeeklyLeagueResponse } from "@/services/friends/friends.types";
import { CurrentChallengeResponse } from "@/services/challenge/challenge.types";
import { FriendsTodayCard } from "./FriendsTodayCard";
import { WeeklyLeagueCard } from "./WeeklyLeagueCard";
import { ChallengeBanner } from "./ChallengeBanner";

interface SocialHomeSectionProps {
  friends?: FriendActivity[];
  league?: WeeklyLeagueResponse;
  challenge?: CurrentChallengeResponse;
  onFriendClick: (nickname: string) => void;
  onChallengeOpen: () => void;
}

export function SocialHomeSection({
  friends = [],
  league,
  challenge,
  onFriendClick,
  onChallengeOpen,
}: SocialHomeSectionProps) {
  const hasFriendsToday = friends.length > 0;
  const hasChallenge = !!challenge;
  const hasLeague = !!league;

  if (!hasFriendsToday && !hasChallenge && !hasLeague) {
    return null;
  }

  return (
    <Stack spacing={1.5}>
      {hasFriendsToday && (
        <FriendsTodayCard friends={friends} onFriendClick={onFriendClick} />
      )}

      {hasChallenge && (
        <ChallengeBanner challenge={challenge} onOpen={onChallengeOpen} />
      )}

      {hasLeague && <WeeklyLeagueCard league={league} />}
    </Stack>
  );
}

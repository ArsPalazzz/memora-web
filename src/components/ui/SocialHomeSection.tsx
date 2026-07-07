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
  return (
    <Stack spacing={1.5}>
      <FriendsTodayCard friends={friends} onFriendClick={onFriendClick} />

      {challenge && (
        <ChallengeBanner challenge={challenge} onOpen={onChallengeOpen} />
      )}

      {league && <WeeklyLeagueCard league={league} />}
    </Stack>
  );
}

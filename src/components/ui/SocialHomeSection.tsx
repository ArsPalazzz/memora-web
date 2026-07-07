import { FriendActivity } from "@/services/friends/friends.types";
import { FriendsTodayCard } from "./FriendsTodayCard";

interface SocialHomeSectionProps {
  friends?: FriendActivity[];
  onFriendClick: (nickname: string) => void;
}

export function SocialHomeSection({
  friends = [],
  onFriendClick,
}: SocialHomeSectionProps) {
  if (friends.length === 0) {
    return null;
  }

  return <FriendsTodayCard friends={friends} onFriendClick={onFriendClick} />;
}

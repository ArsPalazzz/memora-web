import { Avatar, SxProps, Theme } from "@mui/material";

interface UserAvatarProps {
  nickname: string;
  avatarUrl?: string | null;
  size?: number;
  sx?: SxProps<Theme>;
}

export function UserAvatar({
  nickname,
  avatarUrl,
  size = 40,
  sx,
}: UserAvatarProps) {
  const letter = nickname[0]?.toUpperCase() || "U";

  return (
    <Avatar
      src={avatarUrl ?? undefined}
      alt={nickname}
      sx={{
        width: size,
        height: size,
        fontWeight: 600,
        bgcolor: "primary.main",
        flexShrink: 0,
        ...sx,
      }}
    >
      {letter}
    </Avatar>
  );
}

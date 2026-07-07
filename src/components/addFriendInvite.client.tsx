
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import { useAuth } from "@/utils/auth";
import { useProtectedRequest } from "@/utils/protected";
import { sendFriendRequest } from "@/services/friends/friends";
import { ROUTES } from "@/routes/paths";
import { SectionLoader } from "@/components/ui/Loader";
import { useNotification } from "@/context/NotificationContext";

export default function AddFriendInviteClient() {
  const [searchParams] = useSearchParams();
  const nickname = searchParams.get("u")?.trim() ?? "";
  const navigate = useNavigate();
  const { loading, authenticated } = useAuth();
  const { call } = useProtectedRequest();
  const { notifySuccess, notifyError } = useNotification();
  const startedRef = useRef(false);

  const invitePath = nickname ? ROUTES.addFriendInvite(nickname) : ROUTES.HOME;

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: () => call((token) => sendFriendRequest(nickname, token)),
    onSuccess: () => {
      notifySuccess(`Friend request sent to @${nickname}`);
      navigate(ROUTES.userProfile(nickname), { replace: true });
    },
    onError: (err) => {
      notifyError(err.message);
      navigate(ROUTES.userProfile(nickname), { replace: true });
    },
  });

  useEffect(() => {
    if (!nickname) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    if (loading) return;

    if (!authenticated) {
      navigate(ROUTES.loginWithRedirect(invitePath), { replace: true });
      return;
    }

    if (startedRef.current || isPending || isSuccess || isError) {
      return;
    }

    startedRef.current = true;
    mutate();
  }, [authenticated, invitePath, isError, isPending, isSuccess, loading, mutate, navigate, nickname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        gap: 2,
      }}
    >
      <SectionLoader minHeight="20vh" />
      <Typography variant="h6" textAlign="center">
        {nickname ? `Adding @${nickname} as a friend...` : "Redirecting..."}
      </Typography>
    </Box>
  );
}

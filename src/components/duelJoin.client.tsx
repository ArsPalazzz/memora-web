import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { SectionLoader } from "@/components/ui/Loader";
import { useAuth } from "@/utils/auth";
import { useProtectedRequest } from "@/utils/protected";
import { joinDuelRequest } from "@/services/games/duel";
import { ROUTES } from "@/routes/paths";
import { useNotification } from "@/context/NotificationContext";

export default function DuelJoinClient() {
  const { code = "" } = useParams();
  const normalizedCode = code.trim().toUpperCase();
  const navigate = useNavigate();
  const { loading, authenticated } = useAuth();
  const { call } = useProtectedRequest();
  const { notifyError } = useNotification();
  const startedRef = useRef(false);

  const invitePath = normalizedCode ? ROUTES.duelJoin(normalizedCode) : ROUTES.HOME;

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: () => call((token) => joinDuelRequest(normalizedCode, token)),
    onSuccess: ({ duel }) => {
      navigate(ROUTES.duelLobby(duel.id), { replace: true });
    },
    onError: (err: Error) => {
      notifyError(err.message);
    },
  });

  useEffect(() => {
    if (!normalizedCode) {
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
  }, [
    authenticated,
    invitePath,
    isError,
    isPending,
    isSuccess,
    loading,
    mutate,
    navigate,
    normalizedCode,
  ]);

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
        Joining duel {normalizedCode}...
      </Typography>
    </Box>
  );
}

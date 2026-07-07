
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useProtectedRequest } from "@/utils/protected";
import { startDeskSessionRequest } from "@/services/games/games";
import { FullPageLoader } from "./ui/Loader";
import { PlayScreen } from "./play/PlayScreen";

export default function PlayDeskPage() {
  const params = useParams() as { id: string };
  const deskSub = params.id;

  const navigate = useNavigate();
  const location = useLocation();
  const { call } = useProtectedRequest();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const startedRef = useRef(false);

  const startSessionMutation = useMutation({
    mutationFn: async (deskSub: string) => {
      return await call((token) => startDeskSessionRequest(deskSub, token));
    },
    onSuccess: (res) => setSessionId(res.sessionId),
    onError: (err) => console.log("ERROR", err),
  });

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    startSessionMutation.mutate(deskSub);
  }, [deskSub]);

  const handleLeave = () => {
    const from =
      (location.state as { from?: string } | null)?.from ?? `/desk/${deskSub}`;
    navigate(from, { replace: true });
  };

  if (!sessionId && startSessionMutation.isPending) {
    return <FullPageLoader />;
  }

  return (
    <PlayScreen
      sessionId={sessionId}
      onFinished={handleLeave}
      onExit={handleLeave}
    />
  );
}

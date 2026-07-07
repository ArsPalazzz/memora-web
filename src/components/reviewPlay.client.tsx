
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlayScreen } from "./play/PlayScreen";
import { ROUTES } from "@/routes/paths";

export default function ReviewPlayClient() {
  const params = useParams() as { id: string };
  const sessionId = params.id;
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: string } | null)?.from ?? ROUTES.HOME;

  const handleLeave = () => {
    navigate(from, { replace: true });
  };

  return (
    <PlayScreen
      sessionId={sessionId}
      onFinished={handleLeave}
      onExit={handleLeave}
    />
  );
}

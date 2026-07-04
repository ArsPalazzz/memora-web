
import { useParams, useNavigate } from "react-router-dom";
import { PlayScreen } from "./play/PlayScreen";

export default function ReviewPlayClient() {
  const params = useParams() as { id: string };
  const sessionId = params.id;

  const navigate = useNavigate();

  return (
    <PlayScreen sessionId={sessionId} onFinished={() => navigate("/home")} />
  );
}

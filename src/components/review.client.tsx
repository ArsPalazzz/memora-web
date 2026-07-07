
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import { startReviewSessionRequest } from "@/services/games/games";
import { ROUTES } from "@/routes/paths";

export default function ReviewClient() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { call } = useProtectedRequest();
  const [loading, setLoading] = useState(false);
  const batchId = searchParams.get("batchId");

  useEffect(() => {
    if (!batchId) {
      navigate("/home");
      return;
    }

    const startSession = async () => {
      setLoading(true);
      try {
        const { sessionId } = await call((token) =>
          startReviewSessionRequest({ batchId }, token)
        );

        navigate(`/review/${sessionId}/play`, {
          replace: true,
          state: { from: ROUTES.HOME },
        });
      } catch (error) {
        console.error("Failed to start review session:", error);
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [batchId]);

  if (loading) return <FullPageLoader />;

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography>Starting review session...</Typography>
    </Box>
  );
}

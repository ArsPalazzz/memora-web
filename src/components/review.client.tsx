"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import { FullPageLoader } from "@/components/ui/Loader";
import { startReviewSessionRequest } from "@/services/games/games";

export default function ReviewClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { call } = useProtectedRequest();
  const [loading, setLoading] = useState(false);
  const batchId = searchParams.get("batchId");

  useEffect(() => {
    if (!batchId) {
      router.push("/home");
      return;
    }

    const startSession = async () => {
      setLoading(true);
      try {
        const { sessionId } = await call((token) =>
          startReviewSessionRequest({ batchId }, token)
        );

        router.push(`/review/${sessionId}/play`);
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

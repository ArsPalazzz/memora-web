import { useCallback, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useProtectedRequest } from "@/utils/protected";
import {
  getFeedNextCardRequest,
  startFeedSessionRequest,
} from "@/services/games/games";
import { FullPageLoader } from "@/components/ui/Loader";
import { PlayScreen } from "@/components/play/PlayScreen";
import WithBottomNav from "@/components/layout/WithBottomNav";
import Header from "@/components/layout/Header";
import {
  DEFAULT_FEED_STUDY_MODE,
  STUDY_MODE_LABELS,
  StudyMode,
} from "@/constants/studyMode.const";
import {
  FeedStudyEmpty,
  FeedStudyError,
} from "@/components/play/FeedStudyStates";

interface FeedStudyPlayProps {
  preferredMode: StudyMode;
}

export default function FeedStudyPlay({ preferredMode }: FeedStudyPlayProps) {
  const { call } = useProtectedRequest();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [resolvedMode, setResolvedMode] = useState<StudyMode>(preferredMode);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const roundKeyRef = useRef(0);
  const activeRoundRef = useRef(0);

  const startRound = useCallback(async () => {
    const roundId = ++activeRoundRef.current;
    setLoading(true);
    setEmpty(false);
    setError(false);
    setSessionId(null);

    try {
      const session = await call((token) => startFeedSessionRequest(token));
      if (roundId !== activeRoundRef.current) return;

      const mode = session.mode ?? preferredMode ?? DEFAULT_FEED_STUDY_MODE;
      setResolvedMode(mode);

      const data = await call((token) =>
        getFeedNextCardRequest({ sessionId: session.sessionId }, token)
      );
      if (roundId !== activeRoundRef.current) return;

      if (!data?.cards?.length) {
        setEmpty(true);
        return;
      }

      roundKeyRef.current += 1;
      setSessionId(session.sessionId);
    } catch (err) {
      if (roundId !== activeRoundRef.current) return;
      console.error("Failed to start feed study session:", err);
      setError(true);
    } finally {
      if (roundId === activeRoundRef.current) {
        setLoading(false);
      }
    }
  }, [call, preferredMode]);

  useEffect(() => {
    startRound();
  }, [startRound]);

  const modeLabel = STUDY_MODE_LABELS[resolvedMode] ?? "Study";

  return (
    <WithBottomNav>
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <Header title={`Feed — ${modeLabel}`} />

        {loading && !sessionId && !empty && !error && <FullPageLoader />}

        {empty && <FeedStudyEmpty onRetry={startRound} />}

        {error && <FeedStudyError onRetry={startRound} />}

        {sessionId && !loading && (
          <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <PlayScreen
              key={`${sessionId}-${roundKeyRef.current}`}
              sessionId={sessionId}
              initialMode={resolvedMode}
              onFinished={startRound}
              nested
            />
          </Box>
        )}
      </Box>
    </WithBottomNav>
  );
}

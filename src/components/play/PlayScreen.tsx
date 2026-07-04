import { useEffect, useState } from "react";
import { FullPageLoader } from "@/components/ui/Loader";
import { useProtectedRequest } from "@/utils/protected";
import { getMatchBoardRequest, getNextCardRequest } from "@/services/games/games";
import { MatchBoardResponse, NextCardResponse } from "@/services/games/games.types";
import { DEFAULT_DESK_STUDY_MODE, StudyMode } from "@/constants/studyMode.const";
import { WritePlayScreen } from "./WritePlayScreen";
import { RevealPlayScreen } from "./RevealPlayScreen";
import { MatchPlayScreen } from "./MatchPlayScreen";
import { FeedStudyError } from "./FeedStudyStates";

interface PlayScreenProps {
  sessionId: string | null;
  onFinished: () => void;
  initialMode?: StudyMode | null;
}

export function PlayScreen({ sessionId, onFinished, initialMode = null }: PlayScreenProps) {
  const { call } = useProtectedRequest();
  const [boot, setBoot] = useState<{
    mode: StudyMode;
    card: NextCardResponse | null;
    matchBoard: MatchBoardResponse | null;
  } | null>(null);
  const [bootError, setBootError] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setBoot(null);
      setBootError(false);
      return;
    }

    let cancelled = false;
    setBoot(null);
    setBootError(false);

    const resolveBoot = async () => {
      if (initialMode === "match") {
        const matchBoard = await call((token) => getMatchBoardRequest(sessionId, token));
        if (!cancelled) setBoot({ mode: "match", card: null, matchBoard });
        return;
      }

      try {
        const res = await call((token) => getNextCardRequest(sessionId, token));
        const mode = res.mode ?? DEFAULT_DESK_STUDY_MODE;

        if (mode === "match") {
          const matchBoard = await call((token) => getMatchBoardRequest(sessionId, token));
          if (!cancelled) setBoot({ mode: "match", card: null, matchBoard });
          return;
        }

        if (!cancelled) setBoot({ mode, card: res, matchBoard: null });
      } catch {
        try {
          const matchBoard = await call((token) => getMatchBoardRequest(sessionId, token));
          if (!cancelled) setBoot({ mode: "match", card: null, matchBoard });
        } catch {
          if (!cancelled) setBootError(true);
        }
      }
    };

    resolveBoot().catch(() => {
      if (!cancelled) setBootError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId, initialMode, call]);

  if (bootError) {
    return <FeedStudyError onRetry={() => window.location.reload()} />;
  }

  if (!boot) {
    return <FullPageLoader />;
  }

  if (boot.mode === "match") {
    return (
      <MatchPlayScreen
        sessionId={sessionId}
        onFinished={onFinished}
        initialBoard={boot.matchBoard}
      />
    );
  }

  if (boot.mode === "reveal") {
    return (
      <RevealPlayScreen
        sessionId={sessionId}
        onFinished={onFinished}
        initialCard={boot.card}
      />
    );
  }

  return (
    <WritePlayScreen
      sessionId={sessionId}
      onFinished={onFinished}
      initialCard={boot.card}
    />
  );
}

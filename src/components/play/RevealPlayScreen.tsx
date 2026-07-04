import { FullPageLoader } from "@/components/ui/Loader";
import { PlaySessionShell } from "./PlaySessionShell";
import { RevealModeView } from "./RevealModeView";
import { useRevealModeSession } from "./useRevealModeSession";
import { NextCardResponse } from "@/services/games/games.types";

interface RevealPlayScreenProps {
  sessionId: string | null;
  onFinished: () => void;
  initialCard?: NextCardResponse | null;
  nested?: boolean;
}

export function RevealPlayScreen({
  sessionId,
  onFinished,
  initialCard = null,
  nested = false,
}: RevealPlayScreenProps) {
  const {
    result,
    currentCard,
    cardLoading,
    revealAnswer,
    submitGrade,
    isRevealing,
    isGrading,
  } = useRevealModeSession({ sessionId, onFinished, initialCard });

  if (cardLoading && !currentCard) {
    return <FullPageLoader />;
  }

  if (!currentCard) {
    return null;
  }

  return (
    <PlaySessionShell
      current={currentCard.progress.current}
      total={currentCard.progress.total}
      nested={nested}
    >
      <RevealModeView
        currentCard={currentCard}
        result={result}
        isRevealing={isRevealing}
        isGrading={isGrading}
        onReveal={revealAnswer}
        onGrade={submitGrade}
      />
    </PlaySessionShell>
  );
}

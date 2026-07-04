import { FullPageLoader } from "@/components/ui/Loader";
import { PlaySessionShell } from "./PlaySessionShell";
import { WriteModeView } from "./WriteModeView";
import { useWriteModeSession } from "./useWriteModeSession";

import { NextCardResponse } from "@/services/games/games.types";

interface WritePlayScreenProps {
  sessionId: string | null;
  onFinished: () => void;
  initialCard?: NextCardResponse | null;
}

export function WritePlayScreen({
  sessionId,
  onFinished,
  initialCard = null,
}: WritePlayScreenProps) {
  const {
    answer,
    setAnswer,
    result,
    currentCard,
    cardLoading,
    submitAnswer,
    submitGrade,
    isAnswering,
    isGrading,
  } = useWriteModeSession({ sessionId, onFinished, initialCard });

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
    >
      <WriteModeView
        currentCard={currentCard}
        answer={answer}
        result={result}
        isAnswering={isAnswering}
        isGrading={isGrading}
        onAnswerChange={setAnswer}
        onSubmitAnswer={submitAnswer}
        onGrade={submitGrade}
      />
    </PlaySessionShell>
  );
}

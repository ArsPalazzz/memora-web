import { FullPageLoader } from "@/components/ui/Loader";
import { PlaySessionShell } from "./PlaySessionShell";
import { PlayCardTransition } from "./PlayCardTransition";
import { MatchModeView } from "./MatchModeView";
import { MatchResultsView } from "./MatchResultsView";
import { MatchGradingView } from "./MatchGradingView";
import { useMatchModeSession } from "./useMatchModeSession";
import { MatchBoardResponse } from "@/services/games/games.types";
import { FeedStudyEmpty, FeedStudyError } from "./FeedStudyStates";

interface MatchPlayScreenProps {
  sessionId: string | null;
  onFinished: () => void;
  initialBoard?: MatchBoardResponse | null;
  nested?: boolean;
}

export function MatchPlayScreen({
  sessionId,
  onFinished,
  initialBoard = null,
  nested = false,
}: MatchPlayScreenProps) {
  const {
    board,
    boardLoading,
    boardError,
    boardEmpty,
    phase,
    selectedLeft,
    pairs,
    matchedLeftSubs,
    matchedSlotIds,
    recentMatch,
    allPaired,
    resultByCard,
    correctCount,
    gradingIndex,
    selectLeft,
    selectRight,
    unmatchPair,
    submitPairs,
    startGrading,
    submitGrade,
    isSubmitting,
    isGrading,
    reloadBoard,
  } = useMatchModeSession({ sessionId, onFinished, initialBoard });

  if (boardLoading && !board && !boardError && !boardEmpty) {
    return <FullPageLoader />;
  }

  if (boardError) {
    return <FeedStudyError onRetry={reloadBoard} />;
  }

  if (boardEmpty || !board) {
    return (
      <FeedStudyEmpty onRetry={onFinished} />
    );
  }

  const progressCurrent =
    phase === "grading"
      ? gradingIndex + 1
      : phase === "matching"
        ? matchedLeftSubs.size
        : board.progress.total;

  const progressTotal = board.progress.total;

  return (
    <PlaySessionShell current={progressCurrent} total={progressTotal} nested={nested}>
      {phase === "matching" && (
        <MatchModeView
          cards={board.cards}
          rightSlots={board.rightSlots}
          selectedLeft={selectedLeft}
          pairs={pairs}
          matchedLeftSubs={matchedLeftSubs}
          matchedSlotIds={matchedSlotIds}
          recentMatch={recentMatch}
          allPaired={allPaired}
          isSubmitting={isSubmitting}
          onSelectLeft={selectLeft}
          onSelectRight={selectRight}
          onUnmatch={unmatchPair}
          onSubmit={submitPairs}
        />
      )}

      {phase === "results" && (
        <MatchResultsView
          cards={board.cards}
          resultByCard={resultByCard}
          correctCount={correctCount}
          total={board.progress.total}
          onContinue={startGrading}
        />
      )}

      {phase === "grading" && board.cards[gradingIndex] && (
        isGrading ? (
          <PlayCardTransition />
        ) : (
          <MatchGradingView
            card={board.cards[gradingIndex]}
            gradingIndex={gradingIndex}
            total={board.progress.total}
            isGrading={isGrading}
            onGrade={submitGrade}
          />
        )
      )}
    </PlaySessionShell>
  );
}

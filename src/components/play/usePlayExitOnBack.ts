import { useEffect, useRef } from "react";

export function usePlayExitOnBack(enabled: boolean, onExit: () => void) {
  const onExitRef = useRef(onExit);
  onExitRef.current = onExit;
  const handledRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    handledRef.current = false;
    window.history.pushState({ playExitGuard: true }, "");

    const handlePopState = () => {
      if (handledRef.current) return;
      handledRef.current = true;
      onExitRef.current();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}

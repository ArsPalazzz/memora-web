import { useEffect, useState } from "react";
import { useFCM } from "@/hooks/useFCM";

function FCMInner() {
  useFCM();
  return null;
}

export function FCMInitializer() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;

    const userAgent = navigator.userAgent.toLowerCase();
    setEnabled(!/iphone|ipad|ipod/.test(userAgent));
  }, []);

  if (!enabled) {
    return null;
  }

  return <FCMInner />;
}

"use client";

import { useFCM } from "@/hooks/useFCM";

export function FCMInitializer() {
  useFCM();
  return null;
}

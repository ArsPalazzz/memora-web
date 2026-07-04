export const VIEWPORT_SHELL_SX = {
  height: "100dvh",
  maxHeight: "100dvh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
} as const;

/** Top padding for full-screen pages without a header (clears status bar in PWA). */
export const VIEWPORT_TOP_SAFE_PADDING =
  "calc(16px + env(safe-area-inset-top, 0px))";

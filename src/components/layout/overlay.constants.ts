/** Fixed bottom navigation bar. */
export const BOTTOM_NAV_Z_INDEX = 1300;

/** App header — above page content, below modal overlays. */
export const APP_HEADER_Z_INDEX = 1400;

/** Bottom sheets and drawers — above footer nav so actions stay visible. */
export const BOTTOM_SHEET_Z_INDEX = 1500;

export const bottomSheetSlotProps = {
  root: {
    sx: { zIndex: BOTTOM_SHEET_Z_INDEX },
  },
} as const;

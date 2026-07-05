import { CARD_ORIENTATION } from "@/services/desk/desk.const";

export interface FeedSettingsCardOrientationModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: CARD_ORIENTATION;
  onClose: (arg: CARD_ORIENTATION) => void;
}

export interface ThemeTogglerModalProps {
  onClose: () => void;
}

export interface AccentColorModalProps {
  onClose: () => void;
}

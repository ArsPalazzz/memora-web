import { CARD_ORIENTATION } from "@/services/desk/desk.const";

export interface ReviewSettingsCardsPerSessionModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: number;
  onClose: (arg: number) => void;
}

export interface ReviewSettingsCardOrientationModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: CARD_ORIENTATION;
  onClose: (arg: CARD_ORIENTATION) => void;
}

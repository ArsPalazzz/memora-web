import { DeskSettings } from "@/services/desk/desk.types";

export interface DeskSettingsCardsPerSessionModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: number;
  onClose: (arg: number) => void;
}

export interface DeskSettingsCardOrientationModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: DeskSettings["card_orientation"];
  onClose: (arg: DeskSettings["card_orientation"]) => void;
}

export interface DeskSettingsLanguagesModalProps {
  setOpenSheet: (arg: null | string) => void;
  currentValue: Pick<
    DeskSettings,
    "front_language" | "back_language" | "example_language"
  >;
  onClose: (
    arg: Pick<
      DeskSettings,
      "front_language" | "back_language" | "example_language"
    >
  ) => void;
}

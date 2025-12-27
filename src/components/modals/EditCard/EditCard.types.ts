import { FieldErrors, UseFormRegister } from "react-hook-form";
import { UpdateCardValues } from "@/schemas/updateCard.schema";

export interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<UpdateCardValues>;
  register: UseFormRegister<UpdateCardValues>;
}

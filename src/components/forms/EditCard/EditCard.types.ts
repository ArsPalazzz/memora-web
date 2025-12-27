import { UpdateCardValues } from "@/schemas/updateCard.schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface EditCardFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<UpdateCardValues>;
  errors: FieldErrors<UpdateCardValues>;
  onClose: () => void;
}

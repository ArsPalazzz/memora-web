import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateCardValues } from "@/schemas/createCard.schema";

export interface NewCardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<CreateCardValues>;
  register: UseFormRegister<CreateCardValues>;
  control: Control<CreateCardValues>;
  isSubmitting: boolean;
}

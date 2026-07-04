import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { UpdateCardValues } from "@/schemas/updateCard.schema";

export interface EditCardModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<UpdateCardValues>;
  register: UseFormRegister<UpdateCardValues>;
  control: Control<UpdateCardValues>;
  examples: string[];
  onDelete: () => void;
  onRegenerateExamples?: () => void;
  isRegeneratingExamples?: boolean;
}

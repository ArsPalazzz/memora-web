import { UpdateCardValues } from "@/schemas/updateCard.schema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export interface EditCardFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<UpdateCardValues>;
  errors: FieldErrors<UpdateCardValues>;
  onClose: () => void;
  control: Control<UpdateCardValues>;
  examples: string[];
  onRegenerateExamples?: () => void;
  isRegeneratingExamples?: boolean;
}

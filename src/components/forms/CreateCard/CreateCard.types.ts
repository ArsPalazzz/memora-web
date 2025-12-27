import { CreateCardValues } from "@/schemas/createCard.schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface CreateCardFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<CreateCardValues>;
  errors: FieldErrors<CreateCardValues>;
  onClose: () => void;
}

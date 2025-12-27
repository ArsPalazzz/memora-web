import { FieldErrors, UseFormRegister } from "react-hook-form";
import { SignUpFormValues } from "@/schemas/signup.schema";

export interface SignUpFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<SignUpFormValues>;
  errors: FieldErrors<SignUpFormValues>;
  isValid: boolean;
}

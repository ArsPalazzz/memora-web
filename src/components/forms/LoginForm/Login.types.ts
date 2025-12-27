import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginFormValues } from "@/schemas/login.schema";

export interface LoginFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isValid: boolean;
}

import { CreateDeskValues } from "@/schemas/createDesk.schema";
import { Control, FieldErrors, UseFormRegister } from "react-hook-form";

export interface CreateDeskFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<CreateDeskValues>;
  errors: FieldErrors<CreateDeskValues>;
  onClose: () => void;
  control: Control<CreateDeskValues>;
  isPending: boolean;
}

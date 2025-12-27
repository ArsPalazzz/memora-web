import { UpdateDeskValues } from "@/schemas/updateDesk.schema";
import { FieldErrors, UseFormRegister } from "react-hook-form";

export interface EditDeskFormProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  register: UseFormRegister<UpdateDeskValues>;
  errors: FieldErrors<UpdateDeskValues>;
  onClose: () => void;
}

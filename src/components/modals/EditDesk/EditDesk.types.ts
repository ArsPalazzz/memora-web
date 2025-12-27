import { FieldErrors, UseFormRegister } from "react-hook-form";
import { UpdateDeskValues } from "@/schemas/updateDesk.schema";

export interface EditDeskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<UpdateDeskValues>;
  register: UseFormRegister<UpdateDeskValues>;
}

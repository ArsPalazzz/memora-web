import { FieldErrors, UseFormRegister } from "react-hook-form";
import { CreateDeskValues } from "@/schemas/createDesk.schema";

export interface NewDeskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<CreateDeskValues>;
  register: UseFormRegister<CreateDeskValues>;
}

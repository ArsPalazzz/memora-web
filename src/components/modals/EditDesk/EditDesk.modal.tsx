import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { EditDeskModalProps } from "./EditDesk.types";
import EditDesk from "@/components/forms/EditDesk/EditDesk.form";

export default function EditDeskModal(props: EditDeskModalProps) {
  const { open, onClose, onSubmit, errors, register } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Desk</DialogTitle>
      <DialogContent>
        <EditDesk
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
        />
      </DialogContent>
    </Dialog>
  );
}

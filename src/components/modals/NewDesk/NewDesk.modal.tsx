import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { NewDeskModalProps } from "./NewDesk.types";
import CreateDesk from "@/components/forms/CreateDesk/CreateDesk.form";

export default function NewDeskModal(props: NewDeskModalProps) {
  const { open, onClose, onSubmit, errors, register } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Desk</DialogTitle>
      <DialogContent>
        <CreateDesk
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
        />
      </DialogContent>
    </Dialog>
  );
}

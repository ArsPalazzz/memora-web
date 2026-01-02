import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { EditCardModalProps } from "./EditCard.types";
import EditCard from "@/components/forms/EditCard/EditCard.form";

export default function EditCardModal(props: EditCardModalProps) {
  const { open, onClose, onSubmit, errors, register, control } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <DialogContent>
        <EditCard
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
          control={control}
        />
      </DialogContent>
    </Dialog>
  );
}

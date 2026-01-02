import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { NewCardModalProps } from "./NewCard.types";
import CreateCard from "@/components/forms/CreateCard/CreateCard.form";

export default function NewCardModal(props: NewCardModalProps) {
  const { open, onClose, onSubmit, errors, register, control } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create New Card</DialogTitle>
      <DialogContent>
        <CreateCard
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

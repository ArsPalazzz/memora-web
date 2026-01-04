import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NewCardModalProps } from "./NewCard.types";
import CreateCard from "@/components/forms/CreateCard/CreateCard.form";

export default function NewCardModal(props: NewCardModalProps) {
  const { open, onClose, onSubmit, errors, register, control, isSubmitting } =
    props;
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: isMobile ? "80vw" : "40vw",
          width: isMobile ? "80vw" : "40vw",
          maxHeight: isMobile ? "90vh" : "40vw",
        },
      }}
    >
      <DialogTitle>Create New Card</DialogTitle>
      <DialogContent>
        <CreateCard
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
          control={control}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

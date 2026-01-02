import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { EditCardModalProps } from "./EditCard.types";
import EditCard from "@/components/forms/EditCard/EditCard.form";

export default function EditCardModal(props: EditCardModalProps) {
  const { open, onClose, onSubmit, errors, register, control } = props;
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

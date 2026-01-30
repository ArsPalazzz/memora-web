import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { EditDeskModalProps } from "./EditDesk.types";
import EditDesk from "@/components/forms/EditDesk/EditDesk.form";

export default function EditDeskModal(props: EditDeskModalProps) {
  const { open, onClose, onSubmit, errors, register } = props;

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
      <DialogTitle>Edit Deck</DialogTitle>
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

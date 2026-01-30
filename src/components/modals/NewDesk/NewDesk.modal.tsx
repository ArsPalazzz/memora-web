import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NewDeskModalProps } from "./NewDesk.types";
import CreateDesk from "@/components/forms/CreateDesk/CreateDesk.form";

export default function NewDeskModal(props: NewDeskModalProps) {
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
      <DialogTitle>Create New Deck</DialogTitle>
      <DialogContent>
        <CreateDesk
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

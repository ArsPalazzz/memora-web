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
  const { open, onClose, onSubmit, errors, register, control, isPending } =
    props;

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      PaperProps={{
        sx: {
          maxWidth: isMobile ? "80vw" : "40vw",
          width: isMobile ? "80vw" : "40vw",
          maxHeight: isMobile ? "min(520px, 85vh)" : "min(480px, 72vh)",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle sx={{ flexShrink: 0 }}>Create New Deck</DialogTitle>
      <DialogContent
        dividers
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: 3,
        }}
      >
        <CreateDesk
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
          control={control}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

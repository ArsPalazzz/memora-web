import {
  Dialog,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { EditCardModalProps } from "./EditCard.types";
import EditCard from "@/components/forms/EditCard/EditCard.form";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditCardModal(props: EditCardModalProps) {
  const {
    open,
    onClose,
    onSubmit,
    errors,
    register,
    control,
    examples,
    onDelete,
  } = props;
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
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Edit Card
        {onDelete && (
          <IconButton
            onClick={onDelete}
            color="error"
            size="small"
            sx={{ ml: 2 }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <EditCard
          onClose={onClose}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
          control={control}
          examples={examples}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

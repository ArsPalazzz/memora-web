import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DeleteDeskModalProps } from "./DeleteDesk.types";

export default function DeleteDeskModal(props: DeleteDeskModalProps) {
  const { open, onClose, onSubmit } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Archive Desk</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to archive this desk?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

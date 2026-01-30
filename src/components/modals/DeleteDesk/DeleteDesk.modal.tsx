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
      <DialogTitle>Archive Deck</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to archive this deck? It will be hidden but you
          can make it visible again at any time
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained" onClick={onSubmit}>
          Archive
        </Button>
      </DialogActions>
    </Dialog>
  );
}

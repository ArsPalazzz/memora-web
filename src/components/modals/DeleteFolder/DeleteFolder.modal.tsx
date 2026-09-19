import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function DeleteFolderModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isPending?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this folder? Archived decks will stay
          in the archive, and this folder will be created again if needed when a
          deck is archived or restored.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onSubmit}
          disabled={isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

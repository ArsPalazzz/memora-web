import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";

interface NewFolderModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

export default function NewFolderModal({
  open,
  onClose,
  onSubmit,
}: NewFolderModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSubmit({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Folder</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Folder Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            sx={{ mt: 2 }}
          >
            Create Folder
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

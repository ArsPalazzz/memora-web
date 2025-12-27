import { Box, Button, DialogActions, TextField } from "@mui/material";
import { CreateDeskFormProps } from "./CreateDesk.types";

const CreateDesk = ({
  onSubmit,
  register,
  errors,
  onClose,
}: CreateDeskFormProps) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Title"
        {...register("title")}
        error={!!errors.title}
        helperText={errors.title?.message}
        fullWidth
      />

      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
      />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Box>
  );
};
export default CreateDesk;

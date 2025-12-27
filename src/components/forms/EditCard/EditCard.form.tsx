import { Box, Button, DialogActions, TextField } from "@mui/material";
import { EditCardFormProps } from "./EditCard.types";

const EditCard = ({
  onSubmit,
  register,
  errors,
  onClose,
}: EditCardFormProps) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Front side"
        {...register("front")}
        error={!!errors.front}
        helperText={errors.front?.message}
        fullWidth
      />

      <TextField
        label="Back side"
        {...register("back")}
        error={!!errors.back}
        helperText={errors.back?.message}
        fullWidth
      />

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Box>
  );
};
export default EditCard;

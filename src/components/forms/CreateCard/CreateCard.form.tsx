import { Box, Button, DialogActions, TextField } from "@mui/material";
import { CreateCardFormProps } from "./CreateCard.types";

const CreateCard = ({
  onSubmit,
  register,
  errors,
  onClose,
}: CreateCardFormProps) => {
  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
    >
      <TextField
        label="Front Side"
        {...register("front")}
        error={!!errors.front}
        helperText={errors.front?.message}
        fullWidth
      />

      <TextField
        label="Back Side"
        {...register("back")}
        error={!!errors.back}
        helperText={errors.back?.message}
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
export default CreateCard;

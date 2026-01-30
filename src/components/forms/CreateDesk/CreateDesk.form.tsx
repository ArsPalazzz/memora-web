import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  FormControlLabel,
  FormHelperText,
  TextField,
} from "@mui/material";
import { CreateDeskFormProps } from "./CreateDesk.types";
import { Controller, useFormState } from "react-hook-form";

const CreateDesk = ({
  onSubmit,
  register,
  errors,
  onClose,
  control,
}: CreateDeskFormProps) => {
  const { isValid, isSubmitting } = useFormState({ control });

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
        sx={{ mt: 1 }}
      />

      <TextField
        label="Description"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        multiline
        rows={3}
        fullWidth
      />

      <Box sx={{ mt: 1 }}>
        <Controller
          name="isPublic"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                }
                label="Public deck"
              />
              <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
                Cards will be displayed in the Feed mode
              </FormHelperText>
            </>
          )}
        />
      </Box>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isValid || isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Box>
  );
};
export default CreateDesk;

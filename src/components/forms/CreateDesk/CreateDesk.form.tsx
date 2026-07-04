import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { CreateDeskFormProps } from "./CreateDesk.types";
import { Controller, useFormState } from "react-hook-form";
import LanguageSelect from "@/components/ui/LanguageSelect";

const CreateDesk = ({
  onSubmit,
  register,
  errors,
  onClose,
  control,
  isPending,
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
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          Languages
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="front_language"
            control={control}
            render={({ field }) => (
              <LanguageSelect
                label="Front language"
                value={field.value}
                onChange={field.onChange}
                helperText="Language of words on the front side"
              />
            )}
          />
          <Controller
            name="back_language"
            control={control}
            render={({ field }) => (
              <LanguageSelect
                label="Back language"
                value={field.value}
                onChange={field.onChange}
                helperText="Language of answers on the back side"
              />
            )}
          />
          <Controller
            name="example_language"
            control={control}
            render={({ field }) => (
              <LanguageSelect
                label="Examples language"
                value={field.value}
                onChange={field.onChange}
                helperText="Language for AI-generated example sentences"
              />
            )}
          />
        </Box>
      </Box>

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
          disabled={!isValid || isSubmitting || isPending}
        >
          Create
        </Button>
      </DialogActions>
    </Box>
  );
};
export default CreateDesk;

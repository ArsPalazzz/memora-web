import { Box, Button, Chip, CircularProgress, TextField } from "@mui/material";
import { CreateCardFormProps } from "./CreateCard.types";
import { useFieldArray, useFormState } from "react-hook-form";
import { useEffect, useState } from "react";

const CreateCard = ({
  onSubmit,
  control,
  errors,
  isSubmitting,
}: CreateCardFormProps) => {
  const {
    fields: frontFields,
    append: appendFront,
    remove: removeFront,
  } = useFieldArray({
    control,
    name: "front",
  });

  const {
    fields: backFields,
    append: appendBack,
    remove: removeBack,
  } = useFieldArray({
    control,
    name: "back",
  });

  const { isValid } = useFormState({ control });

  const [frontInput, setFrontInput] = useState("");
  const [backInput, setBackInput] = useState("");

  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = frontInput.trim();
      if (!trimmed) return;
      if (frontFields.some((f) => f.value === trimmed)) return;
      appendFront({ value: trimmed });
      setFrontInput("");
    }
  };

  const handleBackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = backInput.trim();
      if (!trimmed) return;
      if (backFields.some((f) => f.value === trimmed)) return;
      appendBack({ value: trimmed });
      setBackInput("");
    }
  };

  useEffect(() => {
    setFrontInput("");
    setBackInput("");
  }, []);

  const hasAtLeastOneFrontItem = frontFields.length > 0;
  const hasAtLeastOneBackItem = backFields.length > 0;

  const isFormValid =
    hasAtLeastOneFrontItem && hasAtLeastOneBackItem && isValid;

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box mt={1}>
        <TextField
          label="Front Side"
          value={frontInput}
          onChange={(e) => setFrontInput(e.target.value)}
          onKeyDown={handleFrontKeyDown}
          fullWidth
          error={!!errors.front}
          helperText={errors.front?.message}
        />
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {frontFields.map((field, index) => (
            <Chip
              key={field.id}
              label={field.value}
              onDelete={() => removeFront(index)}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <TextField
          label="Back Side"
          value={backInput}
          onChange={(e) => setBackInput(e.target.value)}
          onKeyDown={handleBackKeyDown}
          fullWidth
          error={!!errors.back}
          helperText={errors.back?.message}
        />
        <Box mt={1} display="flex" gap={1} flexWrap="wrap">
          {backFields.map((field, index) => (
            <Chip
              key={field.id}
              label={field.value}
              onDelete={() => removeBack(index)}
            />
          ))}
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        disabled={!isFormValid || isSubmitting}
        startIcon={isSubmitting && <CircularProgress size={20} />}
      >
        {isSubmitting ? "Creating..." : "Create"}
      </Button>
    </Box>
  );
};
export default CreateCard;

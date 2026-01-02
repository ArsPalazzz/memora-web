import { Box, Button, Chip, TextField } from "@mui/material";
import { EditCardFormProps } from "./EditCard.types";
import { useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";

const EditCard = ({ onSubmit, control, errors }: EditCardFormProps) => {
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

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box>
        <TextField
          label="Front"
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
          label="Back"
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

      <Button type="submit" variant="contained">
        Update
      </Button>
    </Box>
  );
};

export default EditCard;

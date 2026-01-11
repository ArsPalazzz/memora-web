import { alpha, Box, Chip, TextField, useTheme } from "@mui/material";
import { EditCardFormProps } from "./EditCard.types";
import { useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";

const EditCard = ({
  onSubmit,
  control,
  errors,
  examples,
}: EditCardFormProps) => {
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

  const theme = useTheme();

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
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box>
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

      {examples && examples.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Box sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
              Examples ({examples.length})
            </Box>
          </Box>
          <Box
            sx={{
              maxHeight: 150,
              overflowY: "auto",
              bgcolor: alpha(theme.palette.background.default, 0.25),
              borderRadius: 1,
              p: 2,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {examples.map((example, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                {index + 1}. {example}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EditCard;

import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { CreateCardFormProps } from "./CreateCard.types";
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const ADD_VARIANT_HINT = "Type a variant and press Enter or + to add";

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

  const [frontInput, setFrontInput] = useState("");
  const [backInput, setBackInput] = useState("");

  const tryAddFront = (raw = frontInput) => {
    const trimmed = raw.trim();
    if (!trimmed) return false;
    if (frontFields.some((field) => field.value === trimmed)) return false;
    appendFront({ value: trimmed });
    setFrontInput("");
    return true;
  };

  const tryAddBack = (raw = backInput) => {
    const trimmed = raw.trim();
    if (!trimmed) return false;
    if (backFields.some((field) => field.value === trimmed)) return false;
    appendBack({ value: trimmed });
    setBackInput("");
    return true;
  };

  const handleFrontKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAddFront();
    }
  };

  const handleBackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      tryAddBack();
    }
  };

  useEffect(() => {
    setFrontInput("");
    setBackInput("");
  }, []);

  const hasFront = frontFields.length > 0 || frontInput.trim().length > 0;
  const hasBack = backFields.length > 0 || backInput.trim().length > 0;
  const isFormValid = hasFront && hasBack;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    flushSync(() => {
      tryAddFront();
      tryAddBack();
    });
    void onSubmit(e);
  };

  const renderVariantList = (
    fields: typeof frontFields,
    onRemove: (index: number) => void,
    emptyLabel: string
  ) => (
    <Box
      sx={{
        mt: 1,
        minHeight: 40,
        display: "flex",
        gap: 1,
        flexWrap: "wrap",
        alignItems: "center",
        ...(fields.length === 0 && {
          px: 1.5,
          py: 1,
          borderRadius: 1,
          border: "1px dashed",
          borderColor: "divider",
        }),
      }}
    >
      {fields.length === 0 ? (
        <Typography variant="caption" color="text.secondary">
          {emptyLabel}
        </Typography>
      ) : (
        fields.map((field, index) => (
          <Chip
            key={field.id}
            label={field.value}
            onDelete={() => onRemove(index)}
          />
        ))
      )}
    </Box>
  );

  return (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
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
          helperText={errors.front?.message ?? ADD_VARIANT_HINT}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Add front variant"
                  onClick={() => tryAddFront()}
                  disabled={!frontInput.trim()}
                  edge="end"
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {renderVariantList(
          frontFields,
          removeFront,
          "Added front variants will appear here"
        )}
      </Box>

      <Box>
        <TextField
          label="Back Side"
          value={backInput}
          onChange={(e) => setBackInput(e.target.value)}
          onKeyDown={handleBackKeyDown}
          fullWidth
          error={!!errors.back}
          helperText={errors.back?.message ?? ADD_VARIANT_HINT}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Add back variant"
                  onClick={() => tryAddBack()}
                  disabled={!backInput.trim()}
                  edge="end"
                >
                  <AddIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {renderVariantList(
          backFields,
          removeBack,
          "Added back variants will appear here"
        )}
      </Box>

      {!isFormValid && !isSubmitting && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Add at least one variant on the front and back
        </Typography>
      )}

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

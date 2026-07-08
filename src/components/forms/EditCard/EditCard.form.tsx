import { alpha, Box, Button, Chip, CircularProgress, IconButton, TextField, Typography, useTheme } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { EditCardFormProps } from "./EditCard.types";
import { useFieldArray } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { CardImage } from "@/components/ui/CardImage";

const EditCard = ({
  onSubmit,
  control,
  errors,
  examples,
  onRegenerateExamples,
  isRegeneratingExamples = false,
  imageUrl,
  onImageSelected,
  onImageDelete,
  isImageUploading = false,
  isImageDeleting = false,
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
  const imageInputRef = useRef<HTMLInputElement>(null);

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

      <Box>
        <Typography sx={{ fontWeight: 500, fontSize: "0.9rem", mb: 1 }}>
          Photo (optional)
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            {imageUrl ? (
              <CardImage url={imageUrl} size="study" />
            ) : (
              <Box
                sx={{
                  width: 120,
                  height: 80,
                  borderRadius: 1,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  border: "1px dashed",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  No photo
                </Typography>
              </Box>
            )}
            {onImageSelected && (
              <>
                <IconButton
                  aria-label="Change card photo"
                  size="small"
                  disabled={isImageUploading || isImageDeleting}
                  onClick={() => imageInputRef.current?.click()}
                  sx={{
                    position: "absolute",
                    right: -8,
                    bottom: -8,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: 1,
                  }}
                >
                  {isImageUploading ? (
                    <CircularProgress size={14} />
                  ) : (
                    <PhotoCameraIcon sx={{ fontSize: 16 }} />
                  )}
                </IconButton>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImageSelected(file);
                    }
                    e.target.value = "";
                  }}
                />
              </>
            )}
          </Box>
          {imageUrl && onImageDelete && (
            <Button
              size="small"
              disabled={isImageDeleting || isImageUploading}
              onClick={onImageDelete}
            >
              Remove photo
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "0.9rem" }}>
            Examples ({examples.length})
          </Typography>
          {onRegenerateExamples && (
            <Button
              size="small"
              variant="outlined"
              disabled={isRegeneratingExamples}
              onClick={onRegenerateExamples}
              startIcon={
                isRegeneratingExamples ? (
                  <CircularProgress size={14} />
                ) : (
                  <AutorenewIcon fontSize="small" />
                )
              }
            >
              {isRegeneratingExamples ? "Generating..." : "Regenerate"}
            </Button>
          )}
        </Box>

        {examples.length > 0 ? (
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
        ) : (
          <Typography variant="body2" color="text.secondary">
            No examples yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default EditCard;

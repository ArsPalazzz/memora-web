import { Box, Button, Drawer, Typography } from "@mui/material";
import { DeskSettingsLanguagesModalProps } from "./DeskSettings.types";
import { useState } from "react";
import LanguageSelect from "@/components/ui/LanguageSelect";
import { LanguageCode } from "@/constants/language.const";

export default function DeskSettingsLanguagesModal(
  props: DeskSettingsLanguagesModalProps
) {
  const { setOpenSheet, currentValue, onClose } = props;
  const [frontLanguage, setFrontLanguage] = useState<LanguageCode>(
    currentValue.front_language
  );
  const [backLanguage, setBackLanguage] = useState<LanguageCode>(
    currentValue.back_language
  );
  const [exampleLanguage, setExampleLanguage] = useState<LanguageCode>(
    currentValue.example_language
  );

  const handleSave = () => {
    onClose({
      front_language: frontLanguage,
      back_language: backLanguage,
      example_language: exampleLanguage,
    });
    setOpenSheet(null);
  };

  return (
    <Drawer
      open={true}
      anchor="bottom"
      onClose={() => setOpenSheet(null)}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 3,
          minHeight: "50vh",
        },
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Languages
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <LanguageSelect
          label="Front language"
          value={frontLanguage}
          onChange={setFrontLanguage}
          helperText="Language of words on the front side"
        />
        <LanguageSelect
          label="Back language"
          value={backLanguage}
          onChange={setBackLanguage}
          helperText="Language of answers on the back side"
        />
        <LanguageSelect
          label="Examples language"
          value={exampleLanguage}
          onChange={setExampleLanguage}
          helperText="Language for new AI-generated example sentences"
        />
      </Box>

      <Button variant="contained" fullWidth onClick={handleSave}>
        Save
      </Button>
    </Drawer>
  );
}

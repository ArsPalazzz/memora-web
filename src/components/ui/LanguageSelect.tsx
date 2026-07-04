import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  LANGUAGE_LABELS,
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from "@/constants/language.const";

interface LanguageSelectProps {
  label: string;
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  helperText?: string;
}

export default function LanguageSelect({
  label,
  value,
  onChange,
  helperText,
}: LanguageSelectProps) {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as LanguageCode);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange}>
        {SUPPORTED_LANGUAGES.map((code) => (
          <MenuItem key={code} value={code}>
            {LANGUAGE_LABELS[code]}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

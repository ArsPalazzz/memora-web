import { Box } from "@mui/material";
import { SectionLoader } from "@/components/ui/Loader";

export function PlayCardTransition() {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SectionLoader minHeight="55vh" />
    </Box>
  );
}

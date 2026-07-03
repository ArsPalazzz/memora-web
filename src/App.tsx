import { BrowserRouter } from "react-router-dom";
import { Box } from "@mui/material";
import { AppProviders } from "./AppProviders";
import { AppRouter } from "./router";

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <AppRouter />
        </Box>
      </AppProviders>
    </BrowserRouter>
  );
}

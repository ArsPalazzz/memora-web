import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { LoginFormProps } from "./Login.types";
import Link from "next/link";
import { ROUTES } from "@/routes/next";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

const LoginForm = ({ onSubmit, register, errors, isValid }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const inputBackground = theme.palette.mode === "dark" ? "#38394c" : "#d5e4ed";

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 24,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          placeholder="Email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0px 1000px ${inputBackground} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
            },
            "& input:-webkit-autofill:focus": {
              WebkitBoxShadow: `0 0 0px 1000px ${inputBackground} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
            },
          }}
          autoComplete="off"
        />
        <TextField
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0px 1000px ${inputBackground} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
              caretColor: theme.palette.text.primary,
            },
            "& input:-webkit-autofill:focus": {
              WebkitBoxShadow: `0 0 0px 1000px ${inputBackground} inset`,
              WebkitTextFillColor: theme.palette.text.primary,
            },
          }}
          autoComplete="new-password"
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ mt: 2, pt: 1, pb: 1 }}
          disabled={!isValid}
        >
          Login
        </Button>

        <Typography align="center">
          <Link
            href={ROUTES.SIGNUP}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Don&apos;t have an account?
          </Link>
        </Typography>
      </Box>
    </form>
  );
};

export default LoginForm;

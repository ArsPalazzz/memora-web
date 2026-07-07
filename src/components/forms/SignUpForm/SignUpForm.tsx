import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { SignUpFormProps } from "./SignUpForm.types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";

import { NICKNAME_HINT } from "@/constants/nickname.const";

const SignUpForm = ({
  onSubmit,
  register,
  errors,
  isValid,
}: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          placeholder="Nickname"
          fullWidth
          {...register("nickname")}
          error={!!errors.nickname}
          helperText={errors.nickname?.message ?? NICKNAME_HINT}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">@</InputAdornment>
              ),
            },
          }}
          autoComplete="username"
        />
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
                  size="small"
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

        <TextField
          placeholder="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          fullWidth
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  size="small"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
          Sign Up
        </Button>

        <Typography align="center">
          <Link
            to={ROUTES.LOGIN}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Already have an account?
          </Link>
        </Typography>
      </Box>
    </form>
  );
};

export default SignUpForm;

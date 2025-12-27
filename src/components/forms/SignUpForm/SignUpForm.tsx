import { Box, Button, TextField, Typography } from "@mui/material";
import { SignUpFormProps } from "./SignUpForm.types";
import Link from "next/link";
import { ROUTES } from "@/routes/next";

const SignUpForm = ({
  onSubmit,
  register,
  errors,
  isValid,
}: SignUpFormProps) => (
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
        label="Email"
        fullWidth
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        sx={{
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset",
            WebkitTextFillColor: "black",
          },
        }}
        autoComplete="off"
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset",
            WebkitTextFillColor: "black",
          },
        }}
        autoComplete="new-password"
      />

      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        sx={{
          "& input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0px 1000px white inset",
            WebkitTextFillColor: "black",
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
          href={ROUTES.LOGIN}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Already have an account?
        </Link>
      </Typography>
    </Box>
  </form>
);

export default SignUpForm;

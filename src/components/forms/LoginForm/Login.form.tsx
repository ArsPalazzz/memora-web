import { Box, Button, TextField, Typography } from "@mui/material";
import { LoginFormProps } from "./Login.types";
import Link from "next/link";
import { ROUTES } from "@/routes/next";

const LoginForm = ({ onSubmit, register, errors, isValid }: LoginFormProps) => (
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

export default LoginForm;

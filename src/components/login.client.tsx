"use client";

import { Box, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/services/auth/auth";
import { LoginFormValues, loginSchema } from "@/schemas/login.schema";
import LoginForm from "@/components/forms/LoginForm/Login.form";
import { ROUTES } from "@/routes/next";
import { useProtectedRequest } from "@/utils/protected";
import { notifyError } from "@/utils/notification";

export default function LoginClient() {
  const router = useRouter();
  const { setAccessToken } = useAuthContext();
  const { call } = useProtectedRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const loginMutation = useMutation({
    mutationFn: (payload: LoginFormValues) => {
      return call(() => loginRequest(payload), false);
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.push(ROUTES.HOME + "?prefetch=true");
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper sx={{ p: 4, width: 300 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>

        <LoginForm
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          isValid={isValid}
        />
      </Paper>
    </Box>
  );
}

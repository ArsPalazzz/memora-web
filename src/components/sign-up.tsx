"use client";

import { Box, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ROUTES } from "@/routes/next";
import { SignUpFormValues, signUpSchema } from "@/schemas/signup.schema";
import SignUpForm from "@/components/forms/SignUpForm/SignUpForm";
import { notifyError, notifySuccess } from "@/utils/notification";
import { signUpRequest } from "@/services/user/user";
import { useProtectedRequest } from "@/utils/protected";

export default function SignUpClient() {
  const router = useRouter();
  const { call } = useProtectedRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpFormValues) => {
      const payload = { email: data.email, password: data.password };

      return call(() => signUpRequest(payload), false);
    },
    onSuccess: () => {
      notifySuccess("Account created successfully");
      router.push(ROUTES.LOGIN);
    },
    onError: (err) => {
      console.error(err);
      notifyError(err.message);
    },
  });

  const onSubmit = (data: SignUpFormValues) => signUpMutation.mutate(data);

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
          Sign Up
        </Typography>

        <SignUpForm
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          isValid={isValid}
        />
      </Paper>
    </Box>
  );
}


import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/services/auth/auth";
import { LoginFormValues, loginSchema } from "@/schemas/login.schema";
import LoginForm from "@/components/forms/LoginForm/Login.form";
import { ROUTES } from "@/routes/paths";
import { useProtectedRequest } from "@/utils/protected";
import { notifyError } from "@/utils/notification";
import { motion } from "framer-motion";
import Particles from "@/components/ui/Particles";

export default function LoginClient() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthContext();
  const { call } = useProtectedRequest();
  const theme = useTheme();

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
      navigate(ROUTES.HOME);
    },
    onError: (err) => {
      console.warn(err);
      notifyError(err.message);
    },
  });

  const onSubmit = (data: LoginFormValues) => loginMutation.mutate(data);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #2d91e9 0%, #2e6a6d 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Particles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          sx={{
            p: { xs: 2.5, sm: 3, md: 5 },
            width: { xs: "calc(100vw - 32px)", sm: 350, md: 400 },
            maxWidth: "calc(100vw - 32px)",
            borderRadius: { xs: 2.5, sm: 3, md: 4 },
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
            backgroundColor: alpha(theme.palette.background.paper, 0.8),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            position: "relative",
            overflow: "hidden",
            mx: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: { xs: 120, md: 150 },
              height: { xs: 120, md: 150 },
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? "radial-gradient(circle, rgba(103, 58, 183, 0.3) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(33, 150, 243, 0.35) 0%, rgba(33, 150, 243, 0.15) 50%, transparent 90%)",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? "radial-gradient(circle, rgba(255, 107, 139, 0.2) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(33, 203, 243, 0.3) 0%, rgba(33, 203, 243, 0.1) 50%, transparent 90%)",
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "0%",
              width: { xs: 50, md: 60 },
              height: { xs: 50, md: 60 },
              borderRadius: "50%",
              background:
                theme.palette.mode === "dark"
                  ? "radial-gradient(circle, rgba(33, 203, 243, 0.15) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(104, 220, 255, 0.25) 0%, rgba(104, 220, 255, 0.1) 50%, transparent 90%)",
              zIndex: 0,
              filter: "blur(10px)",
            }}
          />

          <Box position="relative" zIndex={1}>
            <Typography
              variant="h4"
              mb={3}
              fontWeight={700}
              textAlign="center"
              sx={{
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
                    : "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.75rem", md: "2.125rem" },
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mb={4}
              textAlign="center"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
              Sign in to continue your learning journey
            </Typography>

            <LoginForm
              onSubmit={handleSubmit(onSubmit)}
              register={register}
              errors={errors}
              isValid={isValid}
            />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

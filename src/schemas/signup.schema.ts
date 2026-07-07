import z from "zod";
import { NICKNAME_HINT, NICKNAME_PATTERN } from "@/constants/nickname.const";

export const signUpSchema = z
  .object({
    nickname: z
      .string()
      .trim()
      .transform((value) => value.toLowerCase())
      .pipe(
        z
          .string()
          .regex(NICKNAME_PATTERN, `Nickname: ${NICKNAME_HINT}`)
      ),
    email: z.email("Email is required"),
    password: z.string().min(5, "Password must be at least 5 characters"),
    confirmPassword: z
      .string()
      .min(5, "Confirm password must be at least 5 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;

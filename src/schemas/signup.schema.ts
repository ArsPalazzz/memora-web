import z from "zod";

export const signUpSchema = z
  .object({
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

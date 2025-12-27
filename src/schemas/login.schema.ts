import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

import z from "zod";

export const updateDeskSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(5, "Description is required")
    .max(300, "Description is too long"),
});

export type UpdateDeskValues = z.infer<typeof updateDeskSchema>;

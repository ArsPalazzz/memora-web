import z from "zod";

export const createDeskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  isPublic: z.boolean(),
});

export type CreateDeskValues = z.infer<typeof createDeskSchema>;

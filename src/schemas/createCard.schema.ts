import z from "zod";

export const createCardSchema = z.object({
  front: z.string().min(1, "Front side is required"),
  back: z.string().min(1, "Back side is required"),
});

export type CreateCardValues = z.infer<typeof createCardSchema>;

import z from "zod";

export const updateCardSchema = z.object({
  front: z.string().min(1, "Front side is required"),
  back: z.string().min(1, "Back side is required"),
});

export type UpdateCardValues = z.infer<typeof updateCardSchema>;

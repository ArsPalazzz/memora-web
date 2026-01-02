import z from "zod";

export const createCardSchema = z.object({
  front: z
    .array(z.object({ value: z.string().min(1, "Front side cannot be empty") }))
    .min(1, "At least one front side is required"),
  back: z
    .array(z.object({ value: z.string().min(1, "Back side cannot be empty") }))
    .min(1, "At least one back side is required"),
});

export type CreateCardValues = z.infer<typeof createCardSchema>;

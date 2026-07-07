import z from "zod";
import { deskVisibilitySchema } from "./createDesk.schema";

export const updateDeskSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title is too long"),
  description: z
    .string()
    .min(5, "Description is required")
    .max(300, "Description is too long"),
  visibility: deskVisibilitySchema.optional(),
});

export type UpdateDeskValues = z.infer<typeof updateDeskSchema>;

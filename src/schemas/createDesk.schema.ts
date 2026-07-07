import z from "zod";
import { SUPPORTED_LANGUAGES } from "@/constants/language.const";

const languageSchema = z.enum(SUPPORTED_LANGUAGES);

export const deskVisibilitySchema = z.enum([
  "private",
  "public",
  "friends",
  "unlisted",
]);

export type DeskVisibility = z.infer<typeof deskVisibilitySchema>;

export const createDeskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  visibility: deskVisibilitySchema,
  front_language: languageSchema,
  back_language: languageSchema,
  example_language: languageSchema,
});

export type CreateDeskValues = z.infer<typeof createDeskSchema>;

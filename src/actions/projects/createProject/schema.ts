import { z } from "zod";
import { ProjectType } from "@/generated/prisma";

export const createProjectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title is required" })
    .max(200, { message: "Title is too long" }),
  type: z.enum(ProjectType, {
    message: "Invalid project type",
  }),
  templateId: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

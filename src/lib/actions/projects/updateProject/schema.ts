import { z } from "zod";
import { ProjectType } from "@/generated/prisma";

export const updateProjectSchema = z.object({
  id: z.string(),
  data: z.object({
    title: z.string().optional(),
    type: z.enum(["post", "article", "ebook", "script"]).optional()
  }).refine(data => data.title !== undefined || data.type !== undefined, {
    message: "At least one field (title or type) must be provided for update"
  })
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
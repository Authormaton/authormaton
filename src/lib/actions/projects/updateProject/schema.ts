import { z } from "zod";

export const updateProjectSchema = z.object({
  id: z.string(),
  data: z.object({
    title: z.string().optional()
  }).refine(data => data.title !== undefined, {
    message: "Title must be provided for update"
  })
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
import { z } from "zod";

export const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

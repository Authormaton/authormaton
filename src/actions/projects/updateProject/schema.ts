import { z } from 'zod';

export const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string()
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

import { z } from 'zod';

export const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().trim().transform((val) => val.replace(/\s+/g, ' ')).min(1, { message: 'Title is required' }).max(200, { message: 'Title is too long' })
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

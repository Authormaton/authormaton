import { z } from 'zod';

export const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, { message: 'Title is required' }).max(200, { message: 'Title is too long' }).transform((val) => val.replace(/\s+/g, ' '))
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

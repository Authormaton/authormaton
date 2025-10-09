import { z } from 'zod';
import { ProjectType } from '@/generated/prisma';

export const CreateProjectSchema = z.object({
  title: z.string().min(1, { message: 'Project title is required.' }),
  type: z.nativeEnum(ProjectType),
});

export type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>;
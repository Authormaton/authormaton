'use server';

import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';
import { DeleteProjectInput } from './schema';

export async function deleteProject(input: DeleteProjectInput): Promise<Result<void>> {
  await prisma.project.delete({
    where: { id: input.id }
  });

  return success(undefined);
}

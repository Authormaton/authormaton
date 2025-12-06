import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, err } from '@/lib/result';
import { DeleteProjectInput } from './schema';

export async function deleteProject(input: DeleteProjectInput): Promise<Result<undefined>> {
  try {
    await prisma.project.deleteMany({
      where: { id: input.id }
    });
    return success(undefined);
  } catch (error) {
    console.error("Failed to delete project:", error);
    return err("Failed to delete project due to an unexpected error.");
  }
}

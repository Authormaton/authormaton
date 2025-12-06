import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';
import { Project } from '@/generated/prisma';
import { UpdateProjectInput } from './schema';

import { error, ErrorCodes } from '@/lib/result';

export async function updateProject(input: UpdateProjectInput): Promise<Result<Project>> {
  const { id, title, lastUpdatedAt } = input;

  const whereCondition = lastUpdatedAt
    ? {
        id,
        updatedAt: new Date(lastUpdatedAt),
      }
    : { id };

  try {
    const updatedProject = await prisma.project.update({
      where: whereCondition,
      data: {
        title,
      },
    });

    return success(updatedProject);
  } catch (e: any) {
    if (e.code === 'P2025') {
      // P2025 error code indicates that a record to update was not found.
      // In our case, this means either the project ID didn't exist (handled upstream)
      // or the updatedAt timestamp didn't match, implying an optimistic locking conflict.
      return error('Project was modified by another user. Please refresh and try again.', ErrorCodes.CONFLICT);
    }
    throw e; // Re-throw any other unexpected errors
  }
}

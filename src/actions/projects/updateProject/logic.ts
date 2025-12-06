import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';
import { Project } from '@/generated/prisma';
import { UpdateProjectInput } from './schema';

import { error, ErrorCodes } from '@/lib/result';

export async function updateProject(input: UpdateProjectInput): Promise<Result<Project>> {
  const { id, title, lastUpdatedAt } = input;

  try {
    let updatedProject: Project;
    if (lastUpdatedAt) {
      const result = await prisma.project.updateMany({
        where: {
          id,
          updatedAt: new Date(lastUpdatedAt),
        },
        data: {
          title,
        },
      });

      if (result.count === 0) {
        return error('Project was modified by another user. Please refresh and try again.', ErrorCodes.CONFLICT);
      }

      // Fetch the updated project as updateMany does not return the updated record
      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        // This case should ideally not happen if updateMany succeeded, but good to have a check
        return error('Updated project not found.', ErrorCodes.NOT_FOUND);
      }
      updatedProject = project;

    } else {
      updatedProject = await prisma.project.update({
        where: { id },
        data: {
          title,
        },
      });
    }

    return success(updatedProject);
  } catch (e: any) {
    if (e.code === 'P2025') {
      // P2025 error code indicates that a record to update was not found.
      // This specifically handles the case where the project ID does not exist
      // when lastUpdatedAt is NOT provided.
      return error('Project was modified by another user. Please refresh and try again.', ErrorCodes.CONFLICT);
    }
    throw e; // Re-throw any other unexpected errors
  }
}

import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, error } from '@/lib/result';
import { Project } from '@/generated/prisma';
import { CreateProjectInput } from './schema';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export async function createProject(
  input: CreateProjectInput & { content?: string },
  userId: string
): Promise<Result<Project>> {
  const { title, type, content } = input;

  // Guard clause to ensure userId is provided, though typically handled by middleware
  if (!userId) {
    return error('Authentication required: User ID is missing.');
  }

  try {
    const existingProject = await prisma.project.findFirst({
      where: {
        title,
        userId,
      },
    });

    if (existingProject) {
      return error('A project with this title already exists for your account.');
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        type,
        userId,
        content: content || ''
      }
    });

    return success(newProject);
  } catch (e) {
    // Log the error for internal debugging (not exposed to the user)
    console.error('Failed to create project:', e);

    // Handle specific Prisma errors for better client-side feedback
    if (e instanceof PrismaClientKnownRequestError) {
      // P2002 is a unique constraint violation, e.g., if a project title needs to be unique per user
      if (e.code === 'P2002') {
        return error('A project with this title already exists.');
      }
      // Generic Prisma error
      return error(`Database error: ${e.message}`);
    }

    // Handle any other unexpected errors
    return error('An unexpected error occurred while creating the project.');
  }
}

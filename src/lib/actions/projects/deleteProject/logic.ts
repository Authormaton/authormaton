"use server";

import { prisma } from "@/lib/prisma";
import { error, Result, success } from "@/lib/result";
import { DeleteProjectInput } from "./schema";

export async function deleteProject(input: DeleteProjectInput, userId: string): Promise<Result<void>> {
  try {

    const { id } = input;

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existingProject) {
      return error("Project not found or you do not have permission to delete it");
    }

    // Delete the project
    await prisma.project.delete({
      where: { id },
    });

    return success(undefined);
  } catch (err) { // Changed from 'error' to 'err'
    console.error("Project deletion error:", err);
    return error("Internal server error");
  }
}
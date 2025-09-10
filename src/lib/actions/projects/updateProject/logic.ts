"use server";

import { prisma } from "@/lib/prisma";
import { error, Result, success } from "@/lib/result";
import { Project } from "@/generated/prisma";
import { UpdateProjectInput } from "./schema";


export async function updateProject(input: UpdateProjectInput, userId: string): Promise<Result<Project>> {
  try {
    const { id, data } = input;

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: userId,
      },
    });

    if (!existingProject) {
      return error("Project not found or you do not have permission to update it");
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        // updatedAt will be automatically updated by Prisma
      },
    });

    return success(updatedProject);
  } catch (err) {
    console.error("Project update error:", err);
    return error("Internal server error");
  }
}
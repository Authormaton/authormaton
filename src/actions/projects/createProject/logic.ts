"use server";

import { prisma } from "@/lib/prisma";
import { error, Result, success } from "@/lib/result";
import { Project } from "@/generated/prisma";
import { CreateProjectInput } from "./schema";

export async function createProject(input: CreateProjectInput, userId: string): Promise<Result<Project>> {
  try {
    const { title, type } = input;

    // Create the project
    const newProject = await prisma.project.create({
      data: {
        title,
        type,
        userId
      }
    });

    return success(newProject);
  } catch (err) {
    console.error("Project creation error:", err);
    return error("Internal server error");
  }
}
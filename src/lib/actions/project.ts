"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

type DeleteProjectResult = {
  success: boolean;
  error?: string;
};

export async function deleteProject(id: string): Promise<DeleteProjectResult> {
  try {
    // Get token from cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    // Verify token
    const payload = await verifyJWT(token);
    if (!payload) {
      return {
        success: false,
        error: "Invalid token",
      };
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: payload.userId,
      },
    });

    if (!existingProject) {
      return {
        success: false,
        error: "Project not found or you do not have permission to delete it",
      };
    }

    // Delete the project
    await prisma.project.delete({
      where: { id },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Project deletion error:", error);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}

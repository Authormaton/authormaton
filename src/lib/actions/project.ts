'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { Project, ProjectType } from '@/generated/prisma'



type UpdateProjectResult = {
  success: boolean
  project?: Project
  error?: string
}

export async function updateProject(
  id: string,
  data: {
    title?: string
    type?: ProjectType
  }
): Promise<UpdateProjectResult> {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Not authenticated'
      }
    }

    // Verify token
    const payload = await verifyJWT(token)
    if (!payload) {
      return {
        success: false,
        error: 'Invalid token'
      }
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: payload.userId
      }
    })

    if (!existingProject) {
      return {
        success: false,
        error: 'Project not found or you do not have permission to update it'
      }
    }

    // Validate input - at least one field must be provided
    if (!data.title && !data.type) {
      return {
        success: false,
        error: 'At least one field (title or type) must be provided for update'
      }
    }

    // Validate project type if provided
    if (data.type && !Object.values(ProjectType).includes(data.type)) {
      return {
        success: false,
        error: `Type must be one of: ${Object.values(ProjectType).join(', ')}`
      }
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        type: data.type,
        // updatedAt will be automatically updated by Prisma
      }
    })

    return {
      success: true,
      project: updatedProject
    }

  } catch (error) {
    console.error('Project update error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}
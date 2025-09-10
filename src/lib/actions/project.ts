'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { Project, ProjectType } from '@/generated/prisma'
import { Result, success, error } from '@/lib/result'

export async function updateProject(
  id: string,
  data: {
    title?: string
    type?: ProjectType
  }
): Promise<Result<Project>> {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return error('Not authenticated')
    }

    // Verify token
    const payload = await verifyJWT(token)
    if (!payload) {
      return error('Invalid token')
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: payload.userId
      }
    })

    if (!existingProject) {
      return error('Project not found or you do not have permission to update it')
    }

    // Validate input - at least one field must be provided
    if (!data.title && !data.type) {
      return error('At least one field (title or type) must be provided for update')
    }

    // Validate project type if provided
    if (data.type && !Object.values(ProjectType).includes(data.type)) {
      return error(`Type must be one of: ${Object.values(ProjectType).join(', ')}`)
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

    return success(updatedProject)

  } catch (err) {
    console.error('Project update error:', err)
    return error('Internal server error')
  }
}

export async function deleteProject(id: string): Promise<Result<void>> {
  try {
    // Get token from cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return error('Not authenticated')
    }

    // Verify token
    const payload = await verifyJWT(token)
    if (!payload) {
      return error('Invalid token')
    }

    // Check if project exists and belongs to the user
    const existingProject = await prisma.project.findFirst({
      where: {
        id,
        userId: payload.userId
      }
    })

    if (!existingProject) {
      return error('Project not found or you do not have permission to delete it')
    }

    // Delete the project
    await prisma.project.delete({
      where: { id }
    })

    return success(undefined)
  } catch (err) {
    console.error('Project deletion error:', err)
    return error('Internal server error')
  }
}
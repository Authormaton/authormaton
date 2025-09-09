'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { Project, ProjectType } from '@/generated/prisma'

type CreateProjectResult = {
  success: boolean
  project?: Project
  error?: string
}

export async function createProject(
  title: string,
  type: ProjectType
): Promise<CreateProjectResult> {
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

    // Validate input
    if (!title || !type) {
      return {
        success: false,
        error: 'Title and type are required'
      }
    }

    // Validate project type is a valid enum value
    if (!Object.values(ProjectType).includes(type)) {
      return {
        success: false,
        error: `Type must be one of: ${Object.values(ProjectType).join(', ')}`
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        title,
        type,
        userId: payload.userId
      }
    })

    return {
      success: true,
      project
    }

  } catch (error) {
    console.error('Project creation error:', error)
    return {
      success: false,
      error: 'Internal server error'
    }
  }
}
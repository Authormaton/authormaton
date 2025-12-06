import 'server-only';

import { deleteProjectAction } from './action';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { ErrorCodes } from '@/lib/result';
import { deleteProject } from './logic';

// Mock prisma and session
jest.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}));

jest.mock('./logic', () => ({
  deleteProject: jest.fn(),
}));

describe('deleteProjectAction', () => {
  const mockUserId = 'user-123';
  const mockProjectId = 'project-456';
  const unauthorizedErrorMessage = 'You are not authorized to delete this project or it does not exist.';

  beforeEach(() => {
    jest.clearAllMocks();
    (getSession as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
      save: jest.fn(),
    });
  });

  it('should return UNAUTHORIZED if project does not exist or user is not authorized', async () => {
    (prisma.project.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await deleteProjectAction({ id: mockProjectId });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(unauthorizedErrorMessage);
      expect(result.errorCode).toBe(ErrorCodes.UNAUTHORIZED);
    }
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockProjectId,
        userId: mockUserId,
      },
      select: {
        id: true,
      },
    });
    expect(deleteProject).not.toHaveBeenCalled();
  });

  it('should successfully delete a project if authorized', async () => {
    (prisma.project.findFirst as jest.Mock).mockResolvedValue({ id: mockProjectId });
    (deleteProject as jest.Mock).mockResolvedValue({ success: true, data: { id: mockProjectId } });

    const result = await deleteProjectAction({ id: mockProjectId });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ id: mockProjectId });
    }
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockProjectId,
        userId: mockUserId,
      },
      select: {
        id: true,
      },
    });
    expect(deleteProject).toHaveBeenCalledWith({ id: mockProjectId });
  });

  it('should return BAD_REQUEST if deleteProject logic fails', async () => {
    (prisma.project.findFirst as jest.Mock).mockResolvedValue({ id: mockProjectId });
    (deleteProject as jest.Mock).mockResolvedValue({ success: false, error: 'Failed to delete project in logic.', errorCode: ErrorCodes.BAD_REQUEST });

    const result = await deleteProjectAction({ id: mockProjectId });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Failed to delete project in logic.');
      expect(result.errorCode).toBe(ErrorCodes.BAD_REQUEST);
    }
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockProjectId,
        userId: mockUserId,
      },
      select: {
        id: true,
      },
    });
    expect(deleteProject).toHaveBeenCalledWith({ id: mockProjectId });
  });
});

import 'server-only';

import { updateProject } from './logic';
import { prisma } from '@/lib/prisma';
import { Project } from '@/generated/prisma';
import { ErrorCodes } from '@/lib/result';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    project: {
      update: jest.fn(),
      updateMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const mockProject: Project = {
  id: 'project-123',
  title: 'Original Title',
  userId: 'user-456',
  updatedAt: new Date('2025-01-01T10:00:00.000Z'),
  createdAt: new Date('2025-01-01T09:00:00.000Z'),
};

describe('updateProject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update a project successfully when lastUpdatedAt is not provided', async () => {
    (prisma.project.update as jest.Mock).mockResolvedValue({ ...mockProject, title: 'New Title' });

    const input = { id: 'project-123', title: 'New Title' };
    const result = await updateProject(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data?.title).toBe('New Title');
    }
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'project-123' },
      data: { title: 'New Title' },
    });
    expect(prisma.project.updateMany).not.toHaveBeenCalled();
    expect(prisma.project.findUnique).not.toHaveBeenCalled();
  });

  it('should return CONFLICT error if project not found when lastUpdatedAt is not provided', async () => {
    const mockError = new Error('Record not found');
    (mockError as any).code = 'P2025';
    (prisma.project.update as jest.Mock).mockRejectedValue(mockError);

    const input = { id: 'nonexistent-project', title: 'New Title' };
    const result = await updateProject(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Project was modified by another user. Please refresh and try again.');
      expect(result.errorCode).toBe(ErrorCodes.CONFLICT);
    }
    expect(prisma.project.update).toHaveBeenCalledWith({
      where: { id: 'nonexistent-project' },
      data: { title: 'New Title' },
    });
  });

  it('should update a project successfully with optimistic locking when lastUpdatedAt matches', async () => {
    const newUpdatedAt = new Date('2025-01-01T10:05:00.000Z');
    (prisma.project.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
    (prisma.project.findUnique as jest.Mock).mockResolvedValue({ ...mockProject, title: 'New Title', updatedAt: newUpdatedAt });

    const input = { id: 'project-123', title: 'New Title', lastUpdatedAt: mockProject.updatedAt.toISOString() };
    const result = await updateProject(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data?.title).toBe('New Title');
      expect(result.data?.updatedAt).toEqual(newUpdatedAt);
    }
    expect(prisma.project.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'project-123',
        updatedAt: mockProject.updatedAt,
      },
      data: { title: 'New Title' },
    });
    expect(prisma.project.findUnique).toHaveBeenCalledWith({
      where: { id: 'project-123' },
    });
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  it('should return CONFLICT error if lastUpdatedAt does not match (optimistic locking)', async () => {
    (prisma.project.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    const input = { id: 'project-123', title: 'New Title', lastUpdatedAt: new Date('2025-01-01T09:00:00.000Z').toISOString() };
    const result = await updateProject(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Project was modified by another user. Please refresh and try again.');
      expect(result.errorCode).toBe(ErrorCodes.CONFLICT);
    }
    expect(prisma.project.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'project-100',
        updatedAt: new Date('2025-01-01T09:00:00.000Z'),
      },
      data: { title: 'New Title' },
    });
    expect(prisma.project.findUnique).not.toHaveBeenCalled();
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  it('should return BAD_REQUEST error if title is empty', async () => {
    const input = { id: 'project-123', title: '   ' };
    const result = await updateProject(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Title is required');
      expect(result.errorCode).toBe(ErrorCodes.BAD_REQUEST);
    }
    expect(prisma.project.update).not.toHaveBeenCalled();
    expect(prisma.project.updateMany).not.toHaveBeenCalled();
  });

  it('should return BAD_REQUEST error if title is too long', async () => {
    const longTitle = 'a'.repeat(201); // 201 characters long
    const input = { id: 'project-123', title: longTitle };
    const result = await updateProject(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Title is too long');
      expect(result.errorCode).toBe(ErrorCodes.BAD_REQUEST);
    }
    expect(prisma.project.update).not.toHaveBeenCalled();
    expect(prisma.project.updateMany).not.toHaveBeenCalled();
  });
});
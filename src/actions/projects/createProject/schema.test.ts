import { createProjectSchema } from './schema';
import { ProjectType } from '@/generated/prisma';

describe('createProjectSchema', () => {
  it('should validate a valid project input', () => {
    const validProject = {
      title: 'My Project',
      type: ProjectType.ASSISTANT,
      description: 'This is a valid project description.'
    };
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should validate a valid project input without description', () => {
    const validProject = {
      title: 'My Project',
      type: ProjectType.ASSISTANT,
    };
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should validate a valid project input with templateId', () => {
    const validProject = {
      title: 'My Project',
      type: ProjectType.ASSISTANT,
      templateId: 'some-template-id',
    };
    const result = createProjectSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it('should return an error for an empty title', () => {
    const invalidProject = {
      title: '',
      type: ProjectType.ASSISTANT,
    };
    const result = createProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Title is required');
  });

  it('should return an error for a title with only spaces', () => {
    const invalidProject = {
      title: '   ',
      type: ProjectType.ASSISTANT,
    };
    const result = createProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Title is required');
  });

  it('should return an error for a title that is too long', () => {
    const invalidProject = {
      title: 'a'.repeat(201),
      type: ProjectType.ASSISTANT,
    };
    const result = createProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Title is too long');
  });

  it('should return an error for an invalid project type', () => {
    const invalidProject = {
      title: 'My Project',
      type: 'INVALID_TYPE',
    };
    const result = createProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Invalid project type');
  });

  it('should return an error for a description that is too long', () => {
    const invalidProject = {
      title: 'My Project',
      type: ProjectType.ASSISTANT,
      description: 'd'.repeat(1001),
    };
    const result = createProjectSchema.safeParse(invalidProject);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0]?.message).toBe('Description is too long');
  });
});
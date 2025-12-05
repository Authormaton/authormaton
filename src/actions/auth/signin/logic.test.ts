import 'server-only';

import { signin } from './logic';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { getSession } from '@/lib/session';

// Mock prisma and bcryptjs
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('@/lib/session', () => ({
  getSession: jest.fn(),
}));

const mockUser = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'USER',
};

const mockUserWithoutPassword = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
};

describe('signin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getSession as jest.Mock).mockResolvedValue({
      user: null,
      save: jest.fn().mockResolvedValue(undefined),
    });
  });

  it('should successfully sign in a user with valid credentials', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    const input = { email: 'test@example.com', password: 'password123' };
    const result = await signin(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockUserWithoutPassword);
    }
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    const session = await getSession();
    expect(session.user).toEqual({ id: mockUserWithoutPassword.id });
    expect(session.save).toHaveBeenCalled();
  });

  it('should return an error for invalid email (user not found)', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const input = { email: 'nonexistent@example.com', password: 'password123' };
    const result = await signin(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid credentials');
    }
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'nonexistent@example.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    expect(bcryptjs.compare).not.toHaveBeenCalled();
    const session = await getSession();
    expect(session.user).toBe(null);
  });

  it('should return an error for invalid password', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(false);

    const input = { email: 'test@example.com', password: 'wrongpassword' };
    const result = await signin(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('Invalid credentials');
    }
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    expect(bcryptjs.compare).toHaveBeenCalledWith('wrongpassword', 'hashedPassword');
    const session = await getSession();
    expect(session.user).toBe(null);
  });

  it('should handle trimmed email and password input correctly', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValue(true);

    const input = { email: '  Test@Example.com  ', password: '  password123  ' };
    const result = await signin(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(mockUserWithoutPassword);
    }
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
      },
    });
    expect(bcryptjs.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
  });

  it('should return a SIGNIN_FAILED error for an unexpected error during signin', async () => {
    const mockError = new Error('Database connection failed');
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(mockError);

    const input = { email: 'test@example.com', password: 'password123' };
    const result = await signin(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe('SIGNIN_FAILED');
    }
    const session = await getSession();
    expect(session.user).toBe(null);
  });
});

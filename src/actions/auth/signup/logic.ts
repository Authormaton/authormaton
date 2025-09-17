import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, error } from '@/lib/result';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcryptjs from 'bcryptjs';
import { SignupInput } from './schema';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tokens: number;
  createdAt: Date;
}

export async function signup(input: SignupInput): Promise<Result<User>> {
  const { name, email, password } = input;

  const normalisedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: normalisedEmail }
  });

  if (existingUser) {
    return error('User with this email already exists');
  }

  // Hash password and create user
  const hashedPassword = await bcryptjs.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: normalisedEmail,
        password: hashedPassword,
        tokens: 100 // Give new users 100 free tokens
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tokens: true,
        createdAt: true
      }
    });

    return success(user);
  } catch (err) {
    // Handle Prisma unique constraint errors
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return error('User with this email already exists');
    }

    // Re-throw other errors
    throw err;
  }
}

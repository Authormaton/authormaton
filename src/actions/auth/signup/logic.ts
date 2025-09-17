import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, error } from '@/lib/result';
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

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return error('User with this email already exists');
  }

  // Hash password and create user
  const hashedPassword = await bcryptjs.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email,
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
}

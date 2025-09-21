import 'server-only';

import { prisma } from '@/lib/prisma';
import { error, Result, success } from '@/lib/result';
import { getSession } from '@/lib/session';
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
    console.error('Signup error: User with this email already exists');
    return error('Something went wrong');
  }

  // Hash password and create user
  const hashedPassword = await bcryptjs.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalisedEmail,
      password: hashedPassword
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

  const session = await getSession();
  session.user = { id: user.id };
  await session.save();

  return success(user);
}

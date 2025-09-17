import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, error } from '@/lib/result';
import bcryptjs from 'bcryptjs';
import { SigninInput } from './schema';

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function signin(input: SigninInput): Promise<Result<UserWithoutPassword>> {
  const { email, password } = input;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      return error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      return error('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    return success(userWithoutPassword);
  } catch (err) {
    console.error('Sign-in error:', err);
    return error('Internal server error');
  }
}

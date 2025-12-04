import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success, error } from '@/lib/result';
import bcryptjs from 'bcryptjs';
import { SigninInput } from './schema';
import { getSession } from '@/lib/session';

type UserWithoutPassword = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function signin(input: SigninInput): Promise<Result<UserWithoutPassword>> {
  const email = input.email;
  const password = input.password;
  const normalisedEmail = email.toLowerCase().trim();

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: normalisedEmail },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true
      }
    });

    if (!user) {
      console.error('Signin error: User not found');
      return error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password);
    if (!isValidPassword) {
      console.error('Signin error: Invalid password');
      return error('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;

    // Set session
    const session = await getSession();
    session.user = { id: userWithoutPassword.id };
    await session.save();

    return success(userWithoutPassword);
  } catch (err) {
    console.error('Signin logic error:', err, { email });
    return error('An unexpected error occurred during signin.');
  }
}

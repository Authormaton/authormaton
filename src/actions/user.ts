'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/action';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUserId } from '@/lib/action';
import bcrypt from 'bcryptjs';

// Define explicit return types for actions
type ActionResponse = {
  success: boolean;
  error?: string;
};

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.'
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.'
    })
});

export const updateProfile = authActionClient.schema(updateProfileSchema).action(async ({ parsedInput }): Promise<ActionResponse> => {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: parsedInput.name }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    // Log the error for debugging purposes (optional, depending on logging setup)
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile. Please try again.' };
  }
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'Current password must be at least 6 characters.'
  }),
  newPassword: z.string().min(6, {
    message: 'New password must be at least 6 characters.'
  })
});

export const changePassword = authActionClient.schema(changePasswordSchema).action(async ({ parsedInput }): Promise<ActionResponse> => {
  let userId: string;
  try {
    userId = await getAuthenticatedUserId();
  } catch {
    return { success: false, error: 'User not authenticated.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.passwordHash) {
      return { success: false, error: 'User not found or password not configured.' };
    }

    const passwordMatch = await bcrypt.compare(parsedInput.currentPassword, user.passwordHash);

    if (!passwordMatch) {
      return { success: false, error: 'Incorrect current password.' };
    }

    const hashedNewPassword = await bcrypt.hash(parsedInput.newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Error changing password:', error);
    return { success: false, error: 'Failed to change password. Please try again.' };
  }
});

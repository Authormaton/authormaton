

import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/action";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUserId } from "@/lib/session";
import bcrypt from "bcryptjs";

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
});

export const updateProfile = authActionClient.schema(updateProfileSchema).action(async ({ parsedInput }) => {
  const userId = await getAuthenticatedUserId();

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsedInput.name },
  });

  revalidatePath("/profile");
  return { success: true };
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters.",
  }),
});

export const changePassword = authActionClient.schema(changePasswordSchema).action(async ({ parsedInput }) => {
  const userId = await getAuthenticatedUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.passwordHash) {
    throw new Error("User not found or password not set.");
  }

  const passwordMatch = await bcrypt.compare(parsedInput.currentPassword, user.passwordHash);

  if (!passwordMatch) {
    throw new Error("Invalid current password.");
  }

  const hashedNewPassword = await bcrypt.hash(parsedInput.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedNewPassword },
  });

  revalidatePath("/profile");
  return { success: true };
});

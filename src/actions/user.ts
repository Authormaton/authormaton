
import { prisma } from "@/lib/prisma";
import { authActionClient } from "@/lib/action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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

/*
export const updateProfile = authActionClient.schema(updateProfileSchema).action(async ({ parsedInput }) => {
  const userId = await getAuthenticatedUserId();

  await prisma.user.update({
    where: { id: userId },
    data: { name: parsedInput.name },
  });

  revalidatePath("/profile");
  return { success: true };
});
*/

/*
export const changePassword = authActionClient.schema(changePasswordSchema).action(async ({ parsedInput }) => {
  const userId = await getAuthenticatedUserId();

  // TODO: Implement actual password change logic (e.g., hash and compare passwords)
  console.log("Changing password for user", userId, parsedInput);

  revalidatePath("/profile");
  return { success: true };
});
*/

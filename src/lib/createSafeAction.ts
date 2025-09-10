import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/auth";
import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";

export const actionClientBase = createSafeActionClient();

export const actionClient = actionClientBase
  /**
   * Middleware used for auth purposes.
   * Returns the context with the user payload from JWT.
   */
  .use(async ({ next }) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const headerList = await headers();

    let user = null;
    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        user = payload;
      }
    }

    return next({
      ctx: { user, headers: headerList },
    });
  });

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const user = ctx.user;

  if (!user) {
    throw new Error("You are not logged in. Please try to login");
  }

  const userId = user.userId;

  if (!userId) {
    throw new Error("You are not logged in. Please try to login");
  }

  await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { id: true },
  });

  return next({ ctx: { ...ctx, user } });
});

export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  const userId = ctx.user.userId;
  const userRole = ctx.user.role;

  if (userRole !== "ADMIN") {
    throw new Error("You do not have permission to perform this action");
  }

  return next({ ctx });
});

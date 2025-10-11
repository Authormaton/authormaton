import { getSession } from './session';
import { prisma } from './prisma';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
import * as zod from 'zod';
import { Role } from '@/generated/prisma/client';
import { hasProjectPermission } from './permissions';

export function defineMetadataSchema() {
  return zod.object({
    actionName: zod.string()
  });
}

export const actionClient = createSafeActionClient({
  defineMetadataSchema,
  handleServerError: (err: Error) => err.message,
  defaultValidationErrorsShape: 'flattened'
})
  /**
   * Middleware used for auth purposes.
   * Returns the context with the session object.
   */
  .use(async ({ next }) => {
    const session = await getSession();
    const headerList = headers();

    return next({
      ctx: { session, headers: headerList }
    });
  });

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  const userId = ctx.session.user?.id;

  if (!userId) {
    console.error('Malformed cookie', new Error('Invalid user, not allowed'));
    throw new Error('Not Authorised');
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId
    }
  });

  if (!user) {
    console.error('Not Authorised', new Error('Invalid user, not allowed'));
    throw new Error('Not Authorised');
  }

  return next({
    ctx: {
      ...ctx,
      session: {
        destroy: ctx.session.destroy,
        save: ctx.session.save,
        user: {
          id: userId
        }
      },
      user: user, // Add the full user object to the context
    }
  });
});

export const protectedAction = authActionClient.use(async ({ next, ctx, parsedInput }) => {
  const { projectId, requiredRoles } = parsedInput as { projectId: string; requiredRoles: Role[] };

  if (!projectId || !requiredRoles) {
    // If projectId or requiredRoles are not provided, it's not a project-protected action
    return next({
      ctx: {
        ...ctx,
      }
    });
  }

  const projectMember = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId: ctx.user.id,
      },
    },
  });

  if (!projectMember || !hasProjectPermission(projectMember.role, requiredRoles)) {
    throw new Error('Not authorized to perform this action on this project.');
  }

  return next({
    ctx: {
      ...ctx,
      projectMember,
    }
  });
});

export async function getAuthenticatedUserId() {
  const session = await getSession();
  if (!session.user?.id) {
    throw new Error("Not authenticated.");
  }
  return session.user.id;
}

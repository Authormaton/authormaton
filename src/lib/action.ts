import { getSession } from './session';
import { prisma } from './prisma';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
import * as zod from 'zod';

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
      }
    }
  });
});

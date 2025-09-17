'use server';

import { authActionClient } from '@/lib/action';
import { getSession } from '@/lib/session';

export const signoutAction = authActionClient.metadata({ actionName: 'signout' }).action(async () => {
  const session = await getSession();
  session.destroy();
});

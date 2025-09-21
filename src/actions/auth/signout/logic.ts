import 'server-only';

import { Result, success } from '@/lib/result';
import { getSession } from '@/lib/session';

export async function signout(): Promise<Result<undefined>> {
  const session = await getSession();
  session.destroy();
  return success(undefined);
}

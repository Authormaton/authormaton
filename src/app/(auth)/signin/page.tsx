import { SigninPageContainer } from '@/components/pages/signin/SigninPageContainer';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function SigninPage() {
  const session = await getSession();

  if (session.user?.id) {
    redirect('/');
  }

  return <SigninPageContainer />;
}

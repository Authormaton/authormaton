import { SignupPageContainer } from '@/components/pages/signup/SignupPageContainer';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function SignupPage() {
  const session = await getSession();

  if (session.user?.id) {
    redirect('/');
  }

  return <SignupPageContainer />;
}

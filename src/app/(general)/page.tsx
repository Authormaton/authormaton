import { getProjects } from '@/actions/projects/getProjects';
import { BasicAlert } from '@/components/common/BasicAlert';
import { HomePageContainer } from '@/components/pages/home/HomePageContainer';
import { safeAwait } from '@/lib/async';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();
  const userId = session.user?.id;

  if (!userId) {
    redirect('/signin');
  }

  const [error, result] = await safeAwait(getProjects(userId));

  if (error) {
    return <BasicAlert variant='destructive' title='Error loading projects' description={error.message} />;
  }

  if (!result.success) {
    return <BasicAlert variant='destructive' title='Error loading projects' description={result.error} />;
  }

  const projects = result.data;

  return <HomePageContainer projects={projects} />;
}

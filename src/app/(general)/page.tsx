import { getProjects } from '@/actions/projects/getProjects';
import { getProjectAnalytics } from '@/actions/analytics';
import { BasicAlert } from '@/components/common/BasicAlert';
import { HomePageContainer } from '@/components/pages/home/HomePageContainer';
import { ExportDialog } from '@/components/models/projects/ExportDialog';
import { ProjectStats } from '@/components/models/analytics/ProjectStats';
import { safeAwait } from '@/lib/async';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getSession();
  const userId = session.user?.id;

  if (!userId) {
    redirect('/signin');
  }

  const [projectsError, projectsResult] = await safeAwait(getProjects({ userId }));
  const [analyticsError, analyticsResult] = await safeAwait(getProjectAnalytics());

  if (projectsError) {
    return <BasicAlert variant='destructive' title='Error loading projects' description={projectsError.message} />;
  }

  if (!projectsResult.success) {
    return <BasicAlert variant='destructive' title='Error loading projects' description={projectsResult.error} />;
  }

  const { projects: initialProjects, total } = projectsResult.data;

  return <HomePageContainer initialProjects={initialProjects} userId={userId} />;

import { ProjectsTable } from '@/components/models/projects/ProjectsTable';
import { Project } from '@/generated/prisma';
import { HomePageTabs } from './components/HomePageTabs';

export function HomePageContainer({ projects }: { projects: Project[] }) {
  return (
    <div>
      <HomePageTabs />
      <ProjectsTable projects={projects} />
    </div>
  );
}

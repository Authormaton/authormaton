import { ProjectsTable } from '@/components/models/projects/ProjectsTable';
import { CreateProjectButton } from '@/components/models/projects/CreateProjectButton';
import { Project } from '@/generated/prisma';

export function HomePageContainer({ projects }: { projects: Project[] }) {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <CreateProjectButton />
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}

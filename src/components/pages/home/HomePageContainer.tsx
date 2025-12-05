'use client';

import { ProjectsTable } from '@/components/models/projects/ProjectsTable';
import { CreateProjectButton } from '@/components/models/projects/CreateProjectButton';
import { Project } from '@/generated/prisma';
import { getProjects } from '@/actions/projects/getProjects';
import { useEffect, useState } from 'react';
import { useAction } from '@/hooks/use-action';

interface HomePageContainerProps {
  initialProjects: Project[];
  userId: string;
}

export function HomePageContainer({ initialProjects, userId }: HomePageContainerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const { wrappedAction: fetchProjects, isActionLoading: isLoading } = useAction(getProjects);

  useEffect(() => {
    const loadProjects = async () => {
      const result = await fetchProjects({ userId });
      if (result.success) {
        const { projects: fetchedProjects, total } = result.data;
        setProjects(fetchedProjects);
      } else {
        // Handle error, maybe show a toast or alert
        console.error('Failed to fetch projects:', result.error);
      }
    };
    loadProjects();
  }, [fetchProjects, userId]);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <CreateProjectButton />
      </div>
      <ProjectsTable projects={projects} loading={isLoading} />
    </div>
  );
}

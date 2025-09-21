import { BasicTable } from '@/components/common/Table/BasicTable';
import { Project } from '@/generated/prisma';

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <BasicTable
      emptyMessage='No projects found'
      headers={[
        {
          field: 'title',
          label: 'Title'
        },
        {
          field: 'type',
          label: 'Type'
        }
      ]}
      rows={projects.map((project) => ({
        id: project.id,
        rows: [project.title, project.type]
      }))}
    />
  );
}

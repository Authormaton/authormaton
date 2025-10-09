import { FilterDropdown } from '@/components/common/Filter/FilterDropdown';
import { SearchInput } from '@/components/common/Search/SearchInput';
import { BasicTable } from '@/components/common/Table/BasicTable';
import { Project } from '@/generated/prisma';

export function ProjectsTable({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SearchInput placeholder="Search projects..." />
        <div className="flex gap-2">
          <FilterDropdown
            paramName="type"
            label="Type"
            options={[
              { label: "Fiction", value: "FICTION" },
              { label: "Non-Fiction", value: "NON_FICTION" },
            ]}
          />
        </div>
      </div>
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
    </div>
  );
}

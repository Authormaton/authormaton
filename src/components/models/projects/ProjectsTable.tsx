"use client";

import { FilterDropdown } from '@/components/common/Filter/FilterDropdown';
import { SearchInput } from '@/components/common/Search/SearchInput';
import { BasicTable } from '@/components/common/Table/BasicTable';
import { Project } from '@/generated/prisma';
import { useState } from 'react';
import { DeleteProjectDialog } from './DeleteProjectDialog';
import { Button } from '@/components/ui/button';

export function ProjectsTable({ projects: initialProjects }: { projects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteClick = (projectId: string, projectName: string) => {
    setSelectedProject({ id: projectId, name: projectName });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    if (selectedProject) {
      setProjects(projects.filter((p) => p.id !== selectedProject.id));
    }
  };

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
          },
          {
            field: 'actions',
            label: 'Actions'
          }
        ]}
        rows={projects.map((project) => ({
          id: project.id,
          rows: [
            project.title,
            project.type,
            <Button
              key={`delete-${project.id}`}
              variant="destructive"
              onClick={() => handleDeleteClick(project.id, project.title)}
            >
              Delete
            </Button>,
          ]
        }))}
      />
      {selectedProject && (
        <DeleteProjectDialog
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}

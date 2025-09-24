'use client';

import { BasicDialog } from '@/components/common/Dialog/BasicDialog';
import { CreateProjectForm } from './CreateProjectForm';
import { useState } from 'react';

export function CreateProjectDialog({ triggerButton }: { triggerButton: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <BasicDialog
      title='Create New Project'
      description='Create a new project to start working on your content.'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
    >
      <CreateProjectForm />
    </BasicDialog>
  );
}

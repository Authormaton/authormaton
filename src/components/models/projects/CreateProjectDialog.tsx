'use client';

import { BasicDialog } from '@/components/common/Dialog/BasicDialog';
import { CreateProjectForm } from './CreateProjectForm';
import { useState } from 'react';
import { TemplateSelector } from '@/components/models/templates/TemplateSelector';

export function CreateProjectDialog({ triggerButton }: { triggerButton: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('blank');

  return (
    <BasicDialog
      title='Create New Project'
      description='Create a new project to start working on your content.'
      open={open}
      onOpenChange={setOpen}
      triggerButton={triggerButton}
    >
      <div className='grid gap-4 py-4'>
        <h3 className='text-lg font-medium'>Choose a Template</h3>
        <TemplateSelector onTemplateSelect={setSelectedTemplateId} selectedTemplateId={selectedTemplateId} />
        <h3 className='text-lg font-medium'>Project Details</h3>
        <CreateProjectForm selectedTemplateId={selectedTemplateId} setDialogOpen={setOpen} />
      </div>
    </BasicDialog>
  );
}

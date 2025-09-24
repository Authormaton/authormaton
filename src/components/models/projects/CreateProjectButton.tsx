'use client';

import { Button } from '@/components/ui/button';
import { CreateProjectDialog } from './CreateProjectDialog';
import { Plus } from 'lucide-react';

export function CreateProjectButton() {
  return (
    <CreateProjectDialog
      triggerButton={
        <Button className='flex items-center gap-2'>
          <Plus size={16} />
          Create Project
        </Button>
      }
    />
  );
}

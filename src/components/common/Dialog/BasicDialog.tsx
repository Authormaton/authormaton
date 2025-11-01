'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export function BasicDialog({
  title,
  description,
  children,
  onOpenChange,
  open,
  triggerButton
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  onOpenChange: (isOpen: boolean) => void;
  open: boolean;
  triggerButton?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent
        className='sm:max-w-[425px] md:max-w-[1000px] dark:bg-neutral-900 dark:text-white dark:border-neutral-700'
        aria-labelledby='basic-dialog-title' /* Link to the dialog's title for accessibility */
      >
        <DialogHeader>
          <DialogTitle id='basic-dialog-title' className='dark:text-white'> {/* Add ID for aria-labelledby */}
            {title}
          </DialogTitle>
          <DialogDescription className='dark:text-neutral-400'>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

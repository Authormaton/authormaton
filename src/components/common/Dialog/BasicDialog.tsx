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
      <DialogContent className='sm:max-w-[425px] md:max-w-[1000px] dark:bg-neutral-900 dark:text-white dark:border-neutral-700'>
        <DialogHeader>
          <DialogTitle className='dark:text-white'>{title}</DialogTitle>
          <DialogDescription className='dark:text-neutral-400'>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

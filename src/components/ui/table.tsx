'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

function Table({ className, children, emptyMessage, colSpan, ...props }: React.ComponentProps<'table'> & { emptyMessage?: React.ReactNode; colSpan?: number }) {
  let tableBodyChildren: React.ReactNode[] = [];
  let tableHeaderChildren: React.ReactNode[] = [];
  let hasTableBody = false;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TableBody) {
      hasTableBody = true;
      tableBodyChildren = React.Children.toArray(child.props.children);
    }
    if (React.isValidElement(child) && child.type === TableHeader) {
      tableHeaderChildren = React.Children.toArray(child.props.children);
    }
  });

  const isEmpty = hasTableBody && tableBodyChildren.length === 0;

  let effectiveColSpan = colSpan;
  if (emptyMessage && isEmpty && effectiveColSpan === undefined) {
    // Try to infer colSpan from TableHead children
    let headerRowChildren: React.ReactNode[] = [];
    React.Children.forEach(tableHeaderChildren, (headerChild) => {
      if (React.isValidElement(headerChild) && headerChild.type === TableRow) {
        headerRowChildren = React.Children.toArray(headerChild.props.children);
      }
    });
    effectiveColSpan = headerRowChildren.filter(c => React.isValidElement(c) && c.type === TableHead).length;
    if (effectiveColSpan === 0) {
      effectiveColSpan = 1; // Default to 1 if no headers found
    }
  }

  return (
    <div data-slot='table-container' className='relative w-full overflow-x-auto'>
      <table data-slot='table' className={cn('w-full caption-bottom text-sm', className)} {...props}>
        {children}
        {emptyMessage && isEmpty && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={effectiveColSpan} className='h-24 text-center'>
                {emptyMessage}
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </table>
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot='table-row'
      className={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption data-slot='table-caption' className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

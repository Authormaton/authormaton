import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type FooterAggregates = Record<string, React.ReactNode | number | string>;
export type BasicTableRow = { highlight?: boolean; id: string | number; rows: (string | number | React.ReactNode)[] };

export function BasicTable({
  headers,
  rows,
  emptyMessage,
  footerAggregates,
  dense = false,
  className,
  hideIndexColumn = false
}: {
  dense?: boolean;
  headers: {
    label: string;
    field: string;
    component?: React.ReactNode | string;
    align?: 'left' | 'center' | 'right';
    className?: string;
  }[];
  hideIndexColumn?: boolean;
  rows: BasicTableRow[];
  emptyMessage?: string | React.ReactNode;
  footerAggregates?: FooterAggregates;
  className?: string;
}) {
  return (
    <>
      {rows.length === 0 ? (
        emptyMessage ? (
          <div>{emptyMessage}</div>
        ) : null
      ) : (
        <Table className={cn('relative w-full overflow-x-auto', className)}>
          <TableHeader className='sticky top-0 bg-gray-100 dark:bg-black dark:text-[hsl(var(--sidebar-foreground))] z-10'>
            <TableRow>
              {[...(!hideIndexColumn ? [{ field: 'index', label: 'Index' }] : []), ...headers].map((header) => (
                <TableHead
                  className={[
                    'whitespace-nowrap text-xs ',
                    dense ? 'p-2' : '',
                    header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : 'text-left',
                    header.className || ''
                  ].join(' ')}
                  key={header.field}
                >
                  {header.component || header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className='overflow-y-auto'>
            {rows.map(({ id, rows, highlight }, i) => (
              <TableRow
                key={id}
                className={`h-fit ${i % 2 === 0 ? 'bg-gray-50 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-800'} ${highlight ? 'font-bold' : ''} dark:text-[hsl(var(--sidebar-foreground))] `}
              >
                {!hideIndexColumn ? (
                  <TableCell
                    className={['max-w-xs whitespace-nowrap ', dense ? 'p-2' : ''].join(' ')}
                    key={`${id}-${i}`}
                  >
                    {i + 1}
                  </TableCell>
                ) : null}
                {rows.map((cell, j) => {
                  const header = headers[j];
                  return (
                    <TableCell
                      className={[
                        'max-w-xs whitespace-nowrap ',
                        dense ? 'p-2' : '',
                        header && header.align === 'center'
                          ? 'text-center'
                          : header && header.align === 'right'
                            ? 'text-right'
                            : 'text-left',
                        header && header.className ? header.className : ''
                      ].join(' ')}
                      key={`${id}-${j}`}
                    >
                      {cell}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
          {footerAggregates ? (
            <TableFooter className='sticky bottom-[-1.5px] bg-gray-100 dark:bg-black dark:text-[hsl(var(--sidebar-foreground))] z-10'>
              <TableRow>
                {[...(!hideIndexColumn ? [{ field: 'index', label: 'Index' }] : []), ...headers].map((header) => {
                  const headerField = header.field;
                  const aggregateValue = footerAggregates[headerField];
                  const align = header.align || 'left';
                  if (aggregateValue === undefined || aggregateValue === null) {
                    return (
                      <TableCell
                        className={[
                          dense ? 'p-2' : '',
                          align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                        ].join(' ')}
                        key={header.field}
                      >
                        {headerField === 'index' ? rows.length : '-'}
                      </TableCell>
                    );
                  }

                  return (
                    <TableCell
                      className={[
                        dense ? 'p-2' : '',
                        align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                      ].join(' ')}
                      key={header.field}
                    >
                      {aggregateValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableFooter>
          ) : null}
        </Table>
      )}
    </>
  );
}

import { FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export type BasicSelectProps = {
  placeholder?: string;
  required?: boolean;
  label?: string;
  items: { label: string | ReactNode; value: string | number; disabled?: boolean }[];
  // eslint-disable-next-line
  onChange: (...event: any[]) => void;
  value?: string | number | (string | number)[] | null;
  disabled?: boolean;
  className?: string;
  helperText?: string;
  allowEmpty?: boolean;
};

export function BasicSelect({
  placeholder,
  required,
  label,
  items,
  onChange,
  value,
  disabled,
  className,
  helperText,
  allowEmpty = false
}: BasicSelectProps) {
  // Multi-select logic
  // Single-select (existing logic)
  return (
    <div className='w-full'>
      {label && (
        <label className='block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      {helperText && <FormDescription>{helperText}</FormDescription>}
      <div className='relative'>
        <Select
          required={required}
          disabled={disabled}
          onValueChange={onChange}
          value={value?.toString() ?? ''}
          onOpenChange={(isOpen) => {
            if (!isOpen && !value && value !== null) {
              onChange(null);
            }
          }}
        >
          <SelectTrigger
            className={cn(
              'bg-transparent hover:bg-transparent focus:ring-0 border-neutral-700/60 w-full dark:bg-neutral-900 dark:text-white dark:border-neutral-700',
              allowEmpty && value && 'pr-12',
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className='dark:bg-neutral-900 dark:border-neutral-700'>
            <SelectGroup>
              {items.map(({ value, label, disabled }) => (
                <SelectItem
                  key={value}
                  value={value.toString()}
                  disabled={disabled}
                  className='dark:text-white dark:focus:bg-neutral-800 dark:focus:text-white'
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {allowEmpty && value && (
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className='absolute right-2 top-1/2 -translate-y-1/2 hover:bg-neutral-100 dark:hover:bg-neutral-800 p-1.5 rounded-sm'
          >
            <X className='h-3.5 w-3.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50' />
          </button>
        )}
      </div>
    </div>
  );
}

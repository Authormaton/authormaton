'use client';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Control, FieldValues } from 'react-hook-form';
import { BasicSelect } from '../BasicSelect';

export type FormSelectProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>;
  name: string;
  label?: string;
  placeholder?: string;
  items: { label: string | React.ReactNode | number; value: string | number }[];
  className?: string;
  helperText?: string;
  allowEmpty?: boolean;
  required?: boolean;
};

export function FormSelect<TFormValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  items,
  className,
  helperText,
  allowEmpty = false,
  required
}: FormSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <BasicSelect
              label={label}
              items={items}
              disabled={field.disabled}
              className={className}
              helperText={helperText}
              required={required}
              placeholder={placeholder}
              value={field.value}
              onChange={field.onChange}
              allowEmpty={allowEmpty}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

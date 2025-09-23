import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Control, FieldValues, Path } from 'react-hook-form';

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  helperText
}: {
  label: string | React.ReactNode;
  control: Control<T>;
  name: Path<T>;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex flex-row items-start space-y-2 rounded-md'>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={field.disabled} />
          </FormControl>
          <div className='space-y-1 leading-none'>
            <FormLabel>
              {label} {required && <span className='text-red-500'>*</span>}
            </FormLabel>
            {helperText && <div className='text-sm text-gray-500 dark:text-gray-400'>{helperText}</div>}
          </div>
        </FormItem>
      )}
    />
  );
}

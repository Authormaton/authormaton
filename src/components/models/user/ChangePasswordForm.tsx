import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from '@/hooks/use-action';
import { changePassword } from '@/actions/user';
import { toast } from 'sonner';
import { useState } from 'react';
import { BasicAlert } from '@/components/common/BasicAlert';

type ActionErrorShape = {
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function isActionError(e: unknown): e is ActionErrorShape {
  return typeof e === 'object' && e !== null && ('message' in e || 'fieldErrors' in e);
}

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'Current password must be at least 6 characters.'
    }),
    newPassword: z.string().min(6, {
      message: 'New password must be at least 6 characters.'
    }),
    confirmNewPassword: z.string().min(6, {
      message: 'Confirm new password must be at least 6 characters.'
    })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match.',
    path: ['confirmNewPassword']
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export function ChangePasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  const { wrappedAction, isActionLoading } = useAction(changePassword);

  async function onSubmit(data: ChangePasswordFormValues) {
    setFormError(null);
    try {
      await wrappedAction({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully.');
      form.reset();
    } catch (err: unknown) {
      if (isActionError(err)) {
        toast.error(err.message ?? 'Failed to change password.');
        if (err.fieldErrors && typeof err.fieldErrors === 'object') {
          for (const field of Object.keys(err.fieldErrors)) {
            form.setError(field as keyof ChangePasswordFormValues, {
              type: 'server',
              message: err.fieldErrors[field]?.[0]
            });
          }
          setFormError(null);
        } else {
          setFormError(err.message ?? 'Something went wrong.');
        }
      } else {
        toast.error('Failed to change password.');
        setFormError('Something went wrong.');
      }
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
      {formError && <BasicAlert variant='destructive' title='Error' description={formError} />}
      <div className='grid gap-2'>
        <Label htmlFor='currentPassword'>Current Password</Label>
        <Input id='currentPassword' type='password' {...form.register('currentPassword')} />
        {form.formState.errors.currentPassword && (
          <p className='text-sm text-red-500'>{form.formState.errors.currentPassword.message}</p>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='newPassword'>New Password</Label>
        <Input id='newPassword' type='password' {...form.register('newPassword')} />
        {form.formState.errors.newPassword && (
          <p className='text-sm text-red-500'>{form.formState.errors.newPassword.message}</p>
        )}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='confirmNewPassword'>Confirm New Password</Label>
        <Input id='confirmNewPassword' type='password' {...form.register('confirmNewPassword')} />
        {form.formState.errors.confirmNewPassword && (
          <p className='text-sm text-red-500'>{form.formState.errors.confirmNewPassword.message}</p>
        )}
      </div>
      <Button type='submit' disabled={isActionLoading}>
        Change password
      </Button>
    </form>
  );
}

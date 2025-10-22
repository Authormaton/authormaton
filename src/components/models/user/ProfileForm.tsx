import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAction } from '@/hooks/use-action';
import { toast } from 'sonner';
import { updateProfile } from '@/actions/user';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Username must be at least 2 characters.'
    })
    .max(30, {
      message: 'Username must not be longer than 30 characters.'
    }),
  email: z.string().email({
    message: 'Please enter a valid email address.'
  })
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: { name: string; email: string } }) {
  const { execute, isLoading } = useAction(updateProfile, {
    onSuccess: () => {
      toast.success('Profile updated successfully!');
    },
    onError: error => {
      toast.error(error);
    }
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email
    }
  });

  function onSubmit(data: ProfileFormValues) {
    execute(data);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
      <div className='grid gap-2'>
        <Label htmlFor='name'>Name</Label>
        <Input id='name' {...form.register('name')} />
        {form.formState.errors.name && <p className='text-sm text-red-500'>{form.formState.errors.name.message}</p>}
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' type='email' {...form.register('email')} disabled />
        {form.formState.errors.email && <p className='text-sm text-red-500'>{form.formState.errors.email.message}</p>}
      </div>
      <Button type='submit' disabled={isLoading}>Update profile</Button>
    </form>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Role } from '@/generated/prisma/client';

import { BasicDialog } from '@/components/common/Dialog/BasicDialog';
import { FormInput } from '@/components/common/Form/FormInput';
import { FormSelect } from '@/components/common/Form/FormSelect';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { inviteMember, inviteMemberSchema } from '@/actions/collaboration';

interface InviteMemberDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ projectId, open, onOpenChange }: InviteMemberDialogProps) {
  const form = useForm<inviteMemberSchema>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      projectId,
      email: '',
      role: Role.USER
    }
  });

  const onSubmit = async (data: inviteMemberSchema) => {
    const result = await inviteMember(data);
    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      form.reset();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <BasicDialog
      title='Invite Member'
      description='Invite a new member to this project.'
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormInput control={form.control} name='email' label='Email' placeholder='member@example.com' />
          <FormSelect
            control={form.control}
            name='role'
            label='Role'
            options={Object.values(Role).map((role) => ({ label: role, value: role }))}
          />
          <Button type='submit' className='w-full'>
            Invite
          </Button>
        </form>
      </Form>
    </BasicDialog>
  );
}

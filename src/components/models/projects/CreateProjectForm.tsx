'use client';

import { FormInput } from '@/components/common/Form/FormInput';
import { FormSelect } from '@/components/common/Form/FormSelect';
import { FormSkeleton } from '@/components/common/Skeleton/FormSkeleton';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema, CreateProjectFormValues } from '@/lib/validations/projects';
import { ProjectType } from '@/generated/prisma';
import { useAction } from '@/hooks/use-action'; // Custom useAction
import { createProjectAction } from '@/actions/projects/createProject/action';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface CreateProjectFormProps {
  selectedTemplateId: string;
  setDialogOpen: (open: boolean) => void;
}

export function CreateProjectForm({ selectedTemplateId, setDialogOpen }: CreateProjectFormProps) {
  const form = useForm<CreateProjectFormValues>({
    mode: 'onChange',
    resolver: zodResolver(CreateProjectSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      type: ProjectType.article,
      templateId: selectedTemplateId,
    }
  });

  // Update default value for templateId when selectedTemplateId changes
  // This ensures the form reflects the currently selected template in the dialog
  form.setValue('templateId', selectedTemplateId);

  const { wrappedAction, isActionLoading } = useAction(createProjectAction);

  const onSubmit = async (values: CreateProjectFormValues) => {
    const result = await wrappedAction({ ...values, templateId: selectedTemplateId });
    if (result.success) {
      toast.success(`Create project ${result.data.title} successfully`);
      form.reset();
      setDialogOpen(false);
    } else {
      const errorMessage =
        result.error.thrownError?.message ??
        result.error.serverError ??
        'An unknown error occurred';
      toast.error(errorMessage);
    }
  };

  if (isActionLoading) {
    return <FormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput control={form.control} required label='Title' name='title' placeholder='N/A' />
        <FormSelect
          control={form.control}
          items={[
            {
              label: 'Article',
              value: 'article'
            },
            {
              label: 'Ebook',
              value: 'ebook'
            },
            {
              label: 'Newsletter',
              value: 'newsletter'
            }
          ]}
          name='type'
          required
          label='Type'
          helperText='Select what sort of project you want to create'
        />
        <Button
          className='mt-4'
          disabled={isActionLoading || !form.formState.isValid}
          type='submit'
        >
          Create
        </Button>
      </form>
    </Form>
  );
}

'use client';

import { FormInput } from '@/components/common/Form/FormInput';
import { FormSelect } from '@/components/common/Form/FormSelect';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema, CreateProjectFormValues } from '@/lib/validations/projects';
import { ProjectType } from '@/generated/prisma';
import { useAction } from 'next-safe-action/hooks';
import { createProjectAction } from '@/actions/projects/createProject/action';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function CreateProjectForm() {
  const form = useForm<CreateProjectFormValues>({
    mode: 'onChange',
    resolver: zodResolver(CreateProjectSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      type: ProjectType.article
    }
  });

  const { execute, isExecuting } = useAction(createProjectAction, {
    onSuccess: ({ data }) => {
      toast.success(`Create project ${data.title} successfully`);
      form.reset();
    },
    onError: (error) => {
      const errorMessage =
        error.error.thrownError?.message ??
        error.error.serverError ??
        'An unknown error occurred';
      toast.error(errorMessage);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(execute)}>
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
          disabled={isExecuting || !form.formState.isValid}
          type='submit'
        >
          Create
        </Button>
      </form>
    </Form>
  );
}

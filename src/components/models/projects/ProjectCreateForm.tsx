import { FormInput } from '@/components/common/Form/FormInput';
import { FormSelect } from '@/components/common/Form/FormSelect';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

export function ProjectCreateForm() {
  const form = useForm();

  return (
    <Form {...form}>
      <FormInput control={form.control} required label='Title' name='title' placeholder='N/A' />
      <FormSelect
        control={form.control}
        items={[
          {
            label: 'Post',
            value: 'post'
          },
          {
            label: 'Article',
            value: 'article'
          },
          {
            label: 'Ebook',
            value: 'ebook'
          },
          {
            label: 'Script',
            value: 'script'
          }
        ]}
        name='type'
        required
        label='Type'
        helperText='Select what sort of project you want to create'
      />
    </Form>
  );
}

'use client';

import { signupAction } from '@/actions/auth/signup/action';
import { signupSchema } from '@/actions/auth/signup/schema';
import { FormCheckbox } from '@/components/common/Form/FormCheckbox';
import { FormInput } from '@/components/common/Form/FormInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export function SignupForm() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      name: '',
      password: '',
      termsAndConditions: false
    }
  });

  const { execute, isExecuting } = useAction(signupAction, {
    onSuccess: () => {
      toast.success('Signup successful');
      form.reset();
      router.push('/');
    },
    onError: (error) => {
      const fieldErrors = error.error.validationErrors?.fieldErrors;
      const errorMessage =
        error.error.thrownError?.message ??
        error.error.serverError ??
        (fieldErrors
          ? Object.entries(fieldErrors)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : 'An unknown error occurred');
      toast.error(errorMessage);
    }
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Create your account</CardTitle>
          <CardDescription className='text-center'>
            Join Authormaton to start creating amazing content with AI
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <CardContent className='space-y-4'>
              <FormInput control={form.control} name='name' label='Name' placeholder='John Doe' required />
              <FormInput
                control={form.control}
                name='email'
                type='email'
                label='Email'
                placeholder='john@example.com'
                required
              />

              <FormInput
                control={form.control}
                name='password'
                type='password'
                label='Password'
                helperText='Password must be at least 8 characters long and include uppercase, lowercase, and a number.'
                required
              />

              <FormCheckbox
                control={form.control}
                name='termsAndConditions'
                label={
                  <span>
                    I agree to the{' '}
                    <Link href='/terms' className='text-primary'>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href='/privacy' className='text-primary'>
                      Privacy Policy
                    </Link>
                  </span>
                }
                required
              />
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                className='mt-4'
                disabled={isExecuting || !form.formState.isValid || !form.formState.isDirty}
                type='submit'
              >
                {isExecuting ? 'Signing up...' : 'Sign Up'}
              </Button>
              <p className='text-center text-sm text-gray-600'>
                Already have an account?{' '}
                <Link href='/auth/signin' className='text-primary'>
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

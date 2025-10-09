'use client';

import { signinAction } from '@/actions/auth/signin/action';
import { SigninSchema, SigninFormValues } from '@/lib/validations/auth';
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

export function SigninForm() {
  const router = useRouter();
  const form = useForm<SigninFormValues>({
    resolver: zodResolver(SigninSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { execute, isExecuting } = useAction(signinAction, {
    onSuccess: () => {
      toast.success('Signin successful');
      form.reset();
      router.push('/');
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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Welcome back</CardTitle>
          <CardDescription className='text-center'>Sign in to access your Authormaton workspace</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(execute)}>
            <CardContent className='space-y-4'>
              <FormInput
                control={form.control}
                name='email'
                type='email'
                label='Email'
                placeholder='john@example.com'
                required
              />

              <FormInput control={form.control} name='password' type='password' label='Password' required />
            </CardContent>

            <CardFooter className='flex flex-col space-y-4'>
              <Button
                className='mt-4'
                disabled={isExecuting || !form.formState.isValid}
                type='submit'
              >
                {isExecuting ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className='text-center text-sm text-gray-600'>
                Don&apos;t have an account?{' '}
                <Link href='/signup' className='text-primary'>
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

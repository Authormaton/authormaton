'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signupAction } from '@/actions/auth/signup/action';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signupAction({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result?.serverError) {
        setError(result.serverError);
      } else if (result?.data) {
        // Redirect to dashboard on successful sign up
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>Create your account</CardTitle>
          <CardDescription className='text-center'>
            Join Authormaton to start creating amazing content with AI
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label
                htmlFor='name'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Full Name
              </label>
              <Input
                id='name'
                name='name'
                type='text'
                placeholder='John Doe'
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Email
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='john@example.com'
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Password
              </label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='Create a strong password'
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className='space-y-2'>
              <label
                htmlFor='confirmPassword'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                Confirm Password
              </label>
              <Input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className='flex items-center space-x-2'>
              <input
                id='terms'
                type='checkbox'
                className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                required
              />
              <label htmlFor='terms' className='text-sm text-gray-600'>
                I agree to the{' '}
                <Link href='/terms' className='text-blue-600 hover:underline'>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href='/privacy' className='text-blue-600 hover:underline'>
                  Privacy Policy
                </Link>
              </label>
            </div>
            {error && <div className='text-red-600 text-sm text-center'>{error}</div>}
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
            <p className='text-center text-sm text-gray-600'>
              Already have an account?{' '}
              <Link href='/auth/signin' className='text-blue-600 hover:underline font-medium'>
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

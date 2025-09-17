import { z } from 'zod';

export const signinSchema = z.object({
  email: z.email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export type SigninInput = z.infer<typeof signinSchema>;

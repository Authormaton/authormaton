import { z } from 'zod';

export const signinSchema = z.object({
  email: z.string().trim().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long')
});

export type SigninInput = z.infer<typeof signinSchema>;

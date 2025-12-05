import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  termsAndConditions: z
    .boolean()
    .refine((val) => val === true, { message: 'Please accept the terms and conditions to continue.' }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter.')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter.')
    .regex(/(?=.*\d)/, 'Password must contain at least one number.')
});

export type SignupInput = z.infer<typeof signupSchema>;

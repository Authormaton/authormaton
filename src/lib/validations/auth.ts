import { z } from 'zod';

export const SigninSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address.' }),
  password: z.string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' })
});

export const SignupSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().trim().email({ message: 'Invalid email address.' }),
  password: z.string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one digit.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' })
});

export type SigninFormValues = z.infer<typeof SigninSchema>;
export type SignupFormValues = z.infer<typeof SignupSchema>;

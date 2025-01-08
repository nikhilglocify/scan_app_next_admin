import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
export const signupSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });

  // Infer TypeScript type from the Zod schema
export type SignupFormData = z.infer<typeof signupSchema>;
  
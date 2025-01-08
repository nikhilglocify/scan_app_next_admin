import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
export const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1,"Password is required"),
  });

  // Infer TypeScript type from the Zod schema
export type SignInFormData = z.infer<typeof signInSchema>;
  
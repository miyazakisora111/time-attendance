import { z } from 'zod';
import {
  emailSchema,
  passwordSchema,
} from '@/shared/validation';

/**
 * ログインフォーム
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

import type { z } from 'zod';
import type { validationSchemas } from '@/__generated__/zod.validation';

export type LoginFormData = z.infer<typeof validationSchemas.LoginRequest>;

export interface LoginPageProps {
    isSubmitting: boolean;
    onSubmit: (data: LoginFormData) => void;
}

import { useFormContext, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';
import { inputVariants } from '@/shared/design-system/variants/input';
import type { StrictTextareaProps } from '@/shared/design-system/types';
import type { FormFieldProps } from '@/shared/design-system/types';

type TextareaProps<T extends FieldValues> = StrictTextareaProps & FormFieldProps<T>;

export const Textarea = <T extends FieldValues>({
    name,
    label,
    unstableClassName,
    ...props
}: TextareaProps<T>) => {
    const { register, formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <textarea
                {...register(name)}
                {...props}
                className={cn(
                    inputVariants({ variant: fieldError ? 'error' : 'default' }),
                    'h-auto',
                    unstableClassName
                )}
            />
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

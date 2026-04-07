import { useFormContext, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';
import { checkableVariants } from '@/shared/design-system/variants/input';
import type { StrictInputProps } from '@/shared/design-system/types';
import type { FormFieldProps } from '@/shared/design-system/types';

type CheckboxProps<T extends FieldValues> = StrictInputProps & FormFieldProps<T>;

export const Checkbox = <T extends FieldValues>({
    name,
    label,
    unstableClassName,
    ...props
}: CheckboxProps<T>) => {
    const { register, formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                {...register(name)}
                {...props}
                className={cn(
                    checkableVariants(),
                    'rounded',
                    fieldError && 'border-red-500',
                    unstableClassName
                )}
            />
            <label className="text-sm font-medium">{label}</label>
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

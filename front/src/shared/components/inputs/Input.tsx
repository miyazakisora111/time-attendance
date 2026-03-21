import { type InputHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';
import { inputVariants } from '@/shared/design-system/variants/input';

type InputNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

type InputProps<T extends FieldValues> = InputNativeProps & {
    name: FieldPath<T>;
    label: string;
    unstableClassName?: string;
};

export const Input = <T extends FieldValues>({ name, label, unstableClassName, ...props }: InputProps<T>) => {
    const { register, formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                {...register(name)}
                {...props}
                className={cn(
                    inputVariants({ variant: fieldError ? 'error' : 'default' }),
                    unstableClassName
                )}
            />
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};
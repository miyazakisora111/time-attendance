import { type InputHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';

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
                    "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    fieldError ? "border-red-500" : "border-gray-300",
                    unstableClassName
                )}
            />
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};
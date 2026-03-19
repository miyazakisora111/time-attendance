import { type InputHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';

type CheckboxNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

type CheckboxProps<T extends FieldValues> = CheckboxNativeProps & {
    name: FieldPath<T>;
    label: string;
    unstableClassName?: string;
};

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
                    "h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500",
                    fieldError && "border-red-500",
                    unstableClassName
                )}
            />
            <label className="text-sm font-medium">{label}</label>
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

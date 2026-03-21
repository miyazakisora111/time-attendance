import { type SelectHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';
import { inputVariants } from '@/shared/design-system/variants/input';

type SelectOption = {
    value: string | number;
    label: string;
};

type SelectNativeProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'>;

type SelectProps<T extends FieldValues> = SelectNativeProps & {
    name: FieldPath<T>;
    label: string;
    options: SelectOption[];
    unstableClassName?: string;
};

export const Select = <T extends FieldValues>({
    name,
    label,
    options,
    unstableClassName,
    ...props
}: SelectProps<T>) => {
    const { register, formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <select
                {...register(name)}
                {...props}
                className={cn(
                    inputVariants({ variant: fieldError ? 'error' : 'default' }),
                    unstableClassName
                )}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

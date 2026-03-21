import { type InputHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { checkableVariants } from '@/shared/design-system/variants/input';

type RadioNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

type RadioProps<T extends FieldValues> = RadioNativeProps & {
    name: FieldPath<T>;
    label: string;
    value: string | number;
    unstableClassName?: string;
};

export const Radio = <T extends FieldValues>({
    name,
    label,
    value,
    unstableClassName,
    ...props
}: RadioProps<T>) => {
    const {
        register,
        formState: { errors },
    } = useFormContext<T>();

    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex flex-col">
            <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                    type="radio"
                    {...register(name)}
                    {...props}
                    value={value}
                    className={cn(
                        checkableVariants(),
                        fieldError && 'border-red-500',
                        unstableClassName
                    )}
                />
                <span className="text-sm font-medium">{label}</span>
            </label>
        </div>
    );
};

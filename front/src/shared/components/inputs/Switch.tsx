import { type InputHTMLAttributes } from 'react';
import { useFormContext, type FieldPath, type FieldError, type FieldValues } from 'react-hook-form';
import { cn } from '@/shared/utils/style';
import { Error } from '@/shared/components';
import { switchTrackVariants } from '@/shared/design-system/variants/input';

type SwitchNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'>;

type SwitchProps<T extends FieldValues> = SwitchNativeProps & {
    name: FieldPath<T>;
    label: string;
    unstableClassName?: string;
};

export const Switch = <T extends FieldValues>({
    name,
    label,
    unstableClassName,
    ...props
}: SwitchProps<T>) => {
    const { register, formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    {...register(name)}
                    {...props}
                    className="sr-only peer"
                />
                <div
                    className={cn(
                        switchTrackVariants(),
                        fieldError && 'ring-1 ring-red-500',
                        unstableClassName
                    )}
                />
                <span className="ml-3 text-sm font-medium">{label}</span>
            </label>
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

import { useFormContext, type FieldError, type FieldValues } from "react-hook-form";
import { cn } from "@/shared/utils/style";
import { Radio, Error } from '@/shared/components';

type RadioOption = {
    label: string;
    value: string | number;
};

type RadioGroupProps<T extends FieldValues> = {
    name: keyof T & string;
    options: RadioOption[];
    unstableClassName?: string;
    label?: string;
};

export const RadioGroup = <T extends FieldValues>({
    name,
    options,
    unstableClassName,
    label,
}: RadioGroupProps<T>) => {
    const { formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name] as FieldError | undefined;

    return (
        <div className={cn("flex flex-col gap-1", unstableClassName)}>
            {label && <span className="text-sm font-medium">{label}</span>}

            <div className="flex gap-4">
                {options.map(option => (
                    <Radio
                        key={option.value}
                        name={name}
                        label={option.label}
                        value={option.value}
                    />
                ))}
            </div>
            {fieldError && <Error error={fieldError}></Error>}
        </div>
    );
};

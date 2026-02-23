import { useFormContext, type FieldValues } from "react-hook-form";
import { cn } from "@/shared/utils/style";
import { Radio } from "./Radio";

type RadioOption = {
    label: string;
    value: string | number;
};

type RadioGroupProps<T extends FieldValues> = {
    name: keyof T & string;
    options: RadioOption[];
    className?: string;
    label?: string;
};

export const RadioGroup = <T extends FieldValues>({
    name,
    options,
    className,
    label,
}: RadioGroupProps<T>) => {
    const { formState: { errors } } = useFormContext<T>();
    const fieldError = errors[name];

    return (
        <div className={cn("flex flex-col gap-1", className)}>
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

            {fieldError && (
                <p className="text-red-500 text-xs mt-1">{(fieldError as any)?.message}</p>
            )}
        </div>
    );
};

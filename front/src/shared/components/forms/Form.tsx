import { type ReactNode } from 'react';
import {
    FormProvider as RHFFormProvider,
    useForm,
    type UseFormProps,
    type UseFormReturn,
    type FieldValues,
} from 'react-hook-form';

type Props<T extends FieldValues> = {
    children: ReactNode;
    onSubmit?: (data: T) => Promise<void> | void;
    methods?: UseFormReturn<T>;
    formOptions?: UseFormProps<T>;
    className?: string;
};

export const Form = <T extends FieldValues = FieldValues>({
    children,
    onSubmit,
    methods,
    formOptions,
    className,
}: Props<T>) => {
    const internalMethods = useForm<T>(formOptions);
    const formMethods = methods ?? internalMethods;

    const handleSubmit = formMethods.handleSubmit(async (data: T) => {
        if (onSubmit) await onSubmit(data);
    });

    return (
        <RHFFormProvider {...formMethods}>
            <form onSubmit={handleSubmit} className={className}>
                {children}
            </form>
        </RHFFormProvider>
    );
};
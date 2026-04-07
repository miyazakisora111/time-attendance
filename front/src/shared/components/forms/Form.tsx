import { type ReactNode } from 'react';
import {
    FormProvider as RHFFormProvider,
    useForm,
    type FieldValues,
} from 'react-hook-form';
import type { WithFormSubmit, WithFormMethods, WithUnstableClassName, WithChildren } from '@/shared/design-system/types';

type Props<T extends FieldValues> =
    WithChildren &
    WithFormSubmit<T> &
    WithFormMethods<T> &
    WithUnstableClassName;

export const Form = <T extends FieldValues = FieldValues>({
    children,
    onSubmit,
    methods,
    formOptions,
    unstableClassName,
}: Props<T>) => {
    const internalMethods = useForm<T>(formOptions);
    const formMethods = methods ?? internalMethods;

    const handleSubmit = formMethods.handleSubmit(async (data: T) => {
        if (onSubmit) await onSubmit(data);
    });

    return (
        <RHFFormProvider {...formMethods}>
            <form onSubmit={handleSubmit} className={unstableClassName}>
                {children}
            </form>
        </RHFFormProvider>
    );
};
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from '@/shared/components';
import { Spinner } from '@/shared/components/Spinner';

interface SubmitButtonBaseProps {
    children: React.ReactNode;
    loadingText?: string;
}

export type SubmitButtonProps = Omit<ButtonProps, 'type' | 'asChild'> & SubmitButtonBaseProps;

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
    (
        {
            children,
            loadingText = '送信中…',
            disabled: disabledProp,
            className,
            variant,
            size,
            ...rest
        },
        ref
    ) => {
        const { formState } = useFormContext();
        const isSubmitting = formState.isSubmitting;
        const disabled = disabledProp ?? isSubmitting;

        return (
            <Button
                ref={ref}
                type="submit"
                className={className}
                disabled={disabled}
                variant={variant}
                size={size}
                {...rest}
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <Spinner />
                        <span>{loadingText}</span>
                    </div>
                ) : (
                    children
                )}
            </Button>
        );
    }
);

SubmitButton.displayName = 'SubmitButton';
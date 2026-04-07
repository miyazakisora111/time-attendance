import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from '@/shared/components';
import { Spinner } from '@/shared/components/Spinner';

type SubmitButtonBaseProps = {
    children: React.ReactNode;
    loadingText?: string;
};

// TODO: 普通のGETとかの送信ボタンもローディング付けたい。

export type SubmitButtonProps = Omit<ButtonProps, 'type' | 'asChild'> & SubmitButtonBaseProps;

export const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
    (
        {
            children,
            loadingText = '送信中…',
            disabled: disabledProp,
            unstableClassName,
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
                unstableClassName={unstableClassName}
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

SubmitButton.displayName = "SubmitButton";
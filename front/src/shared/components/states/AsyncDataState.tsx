import React from "react";
import { Spinner } from "@/shared/components/Spinner";
import { Typography } from "@/shared/components/Typography";

type Props = {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    children: React.ReactNode;
};

export function AsyncDataState({ isLoading, isError, isEmpty, children }: Props) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8" role="status" aria-label="読み込み中">
                <Spinner />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-8">
                <Typography variant="body" intent="danger">
                    データが取得できませんでした。
                </Typography>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex items-center justify-center py-8">
                <Typography variant="body" intent="muted">
                    データがありません。
                </Typography>
            </div>
        );
    }

    return <>{children}</>;
}
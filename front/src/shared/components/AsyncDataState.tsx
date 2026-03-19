import React from "react";
import { Spinner } from "@/shared/components/Spinner";

type Props = {
    isLoading?: boolean;
    isEmpty?: boolean;
    emptyMessage?: string;
    children: React.ReactNode;
};

export function AsyncDataState({
    isLoading,
    isEmpty,
    emptyMessage = "データがありません",
    children,
}: Props) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Spinner />
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex items-center justify-center py-8 text-gray-500">
                {emptyMessage}
            </div>
        );
    }

    return <>{children}</>;
}
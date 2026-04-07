import { Button } from "@/shared/components";

export interface ErrorFallbackProps {
    error: Error;
    onRetry: () => void;
}

export const ErrorFallback = ({ error, onRetry }: ErrorFallbackProps) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
            <h1 className="text-2xl font-bold text-red-600">
                予期しないエラーが発生しました
            </h1>
            <p className="text-gray-600">{error.message}</p>
            <Button onClick={onRetry} intent="danger">
                再読み込み
            </Button>
        </div>
    );
};

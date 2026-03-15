import { isAxiosError } from "axios";
import { ok as Ok, error as Err, type Result } from "@/shared/http/types/result";
import { AppError, NetworkError } from "@/shared/http/types/errors";

type ErrorPayload = {
    message?: string;
};

/**
 * Promise を Result 型へ変換する。
 *
 * Axios エラー時は message を取り出して NetworkError へ正規化する。
 */
export async function toResult<T>(
    request: () => Promise<T>
): Promise<Result<T, Error>> {
    try {
        const data = await request();
        return Ok(data);
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            const payload = err.response?.data as ErrorPayload | undefined;
            const message =
                payload?.message ?? err.message ?? "Unexpected error";

            return Err(new NetworkError(message));
        }

        return Err(new AppError("Unknown error"));
    }
}

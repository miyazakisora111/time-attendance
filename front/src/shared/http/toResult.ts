import { isAxiosError } from "axios";
import { ok as Ok, error as Err, type Result } from "@/shared/http/types/result";
import { AppError } from "@/shared/http/types/error";

export async function toResult<T>(
    request: () => Promise<T>
): Promise<Result<T, AppError>> {
    try {
        const data = await request();
        return Ok(data);
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            const message =
                (err.response?.data as any)?.message ?? err.message ?? "Unexpected error";

            return Err(
                new AppError(message, {
                    code: String(err.response?.status ?? "NETWORK_ERROR"),
                    cause: err,
                })
            );
        }

        return Err(new AppError("Unknown error", { cause: err }));
    }
}

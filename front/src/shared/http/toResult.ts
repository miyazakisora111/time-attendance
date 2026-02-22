import { isAxiosError } from "axios";
import { ok as Ok, error as Err, type Result } from "@/shared/http/types/result";
import { AppError, NetworkError } from "@/shared/http/types/errors";

export async function toResult<T>(
    request: () => Promise<T>
): Promise<Result<T, Error>> {
    try {
        const data = await request();
        return Ok(data);
    } catch (err: unknown) {
        if (isAxiosError(err)) {
            const message =
                (err.response?.data as any)?.message ?? err.message ?? "Unexpected error";

            return Err(new NetworkError(message));
        }

        return Err(new AppError("Unknown error"));
    }
}

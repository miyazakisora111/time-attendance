import { isAxiosError } from 'axios'
import { Result, ok, error } from '@/shared/types/result'
import { AppError } from '@/shared/types/error'

export async function executeApi<T>(
    request: () => Promise<T>
): Promise<Result<T, AppError>> {
    try {
        const data = await request()
        return ok(data)
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const message =
                (error.response?.data as any)?.message ??
                error.message ??
                'Unexpected error'

            return error({
                message,
                code: String(error.response?.status ?? 'NETWORK_ERROR'),
            })
        }

        return error({
            message: 'Unknown error',
        })
    }
}

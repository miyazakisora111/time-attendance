import { ok, err, type Result } from '@/shared/http/result/result';
import { unwrapApiEnvelope } from '@/shared/http/result/envelope';

export const callResult = async <T>(p: Promise<T>): Promise<Result<T, unknown>> => {
    try {
        const res = await p;
        return ok(unwrapApiEnvelope(res));
    } catch (e) {
        return err(e);
    }
};
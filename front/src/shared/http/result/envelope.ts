export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
};

export const isApiEnvelope = <T = unknown>(payload: unknown): payload is ApiEnvelope<T> =>
  !!payload && typeof payload === 'object' && 'data' in (payload as any) && 'success' in (payload as any);

export const unwrapApiEnvelope = <T>(payload: T | ApiEnvelope<T>): T =>
  isApiEnvelope<T>(payload) ? (payload as ApiEnvelope<T>).data : (payload as T);

export const call = <T>(p: Promise<T>) => p.then(unwrapApiEnvelope);
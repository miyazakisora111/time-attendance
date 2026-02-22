export class AppError extends Error {
    code?: string;
    cause?: unknown;

    constructor(message: string, options?: { code?: string; cause?: unknown }) {
        super(message);

        this.name = "AppError";
        this.code = options?.code;
        this.cause = options?.cause;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
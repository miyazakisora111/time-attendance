export const overrideDefined = <T extends object>(
    base: T,
    overrides: Partial<{ [K in keyof T]: T[K] | null }>
): T => {
    const result = { ...base };
    for (const key in overrides) {
        const value = overrides[key];
        if (value !== undefined && value !== null) {
            result[key as keyof T] = value as T[keyof T];
        }
    }
    return result;
};

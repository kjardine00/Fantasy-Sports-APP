/**
 * Standardized return type for all database operations
 * 
 * This ensures consistency across all queries:
 * - data: The result data, or null if error
 * - error: Error message as string, or null if success
 * 
 * Usage:
 * ```typescript
 * const { data, error } = await someQuery();
 * if (error) {
 *   // Handle error - data is guaranteed to be null
 * }
 * // Use data safely - it's guaranteed to not be null here
 * ```
 */
export type Result<T> = {
    data: T | null;
    error: string | null;
};

export const success = <T>(data: T): Result<T> => ({
    data,
    error: null,
});

export const failure = (error: string): Result<never> => ({
    data: null,
    error,
});
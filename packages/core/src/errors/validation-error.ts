import { CoreError } from "./core-error";

/**
 * error code for ValidationError
 */
export const E_VALIDATION_FAILED = "E_VALIDATION_FAILED";

export type ValidationErrorOptions = {
    context: string;
    errors: readonly Error[];
    summary?: string;
};

/**
 * throw when multiple validation errors occurred.
 */
export class ValidationError extends CoreError {
    readonly errors: readonly Error[];

    constructor({ context, errors, summary }: ValidationErrorOptions) {
        super({
            context,
            code: E_VALIDATION_FAILED,
            reason: `${errors.length} validation errors occurred.`,
            suggestion: "Inspect `errors` and resolve each issue.",
            data: { errors, summary },
        });

        this.errors = errors;
    }

    /**
     * flatten the error messages
     *
     * @example
     * ```ts
     * const validationError = new ValidationError({
     *   context: "User",
     *   errors: [new Error("Invalid email"), new Error("Invalid password")],
     * });
     *
     * const flattenedErrors = validationError.flattenMessages();
     * // flattenedErrors: "Invalid email, Invalid password"
     * ```
     */
    flattenMessages(separator = ", "): string {
        return this.errors.map((err) => err.message).join(separator);
    }
}

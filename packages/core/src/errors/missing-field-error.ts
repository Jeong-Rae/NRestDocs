import { CoreError } from "./core-error";

/**
 * error code for MissingFieldError
 */
export const E_MISSING_FIELD = "E_MISSING_FIELD";

export type MissingFieldErrorOptions = {
    context: string;
    fieldName: string;
    suggestion: string;
};

/**
 * Throw when a required field (configuration, state, dto property …) is missing.
 *
 * @example
 * ```ts
 * if (!this.httpRequestPath) {
 *   throw new MissingFieldError({
 *     context: "DocumentBuilder.doc",
 *     fieldName: "httpRequestPath",
 *     suggestion: "Call `setRequestPath()` before invoking `doc()`.",
 *   });
 * }
 * ```
 */
export class MissingFieldError extends CoreError {
    constructor({ context, fieldName, suggestion }: MissingFieldErrorOptions) {
        super({
            context,
            code: E_MISSING_FIELD,
            reason: `Missing required field: '${fieldName}'`,
            suggestion,
            data: { fieldName },
        });
    }
}

import { CoreError } from "./core-error";

/**
 * error code for missing field
 */
export const E_MISSING_FIELD = "E_MISSING_FIELD";

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
export interface MissingFieldErrorOptions {
    /** location, method, file, etc. where the error occurred */
    context: string;
    /** name of the missing field */
    fieldName: string;
    /** guide for the user to fix the problem */
    suggestion: string;
}

export class MissingFieldError extends CoreError {
    constructor(opts: MissingFieldErrorOptions) {
        super({
            context: opts.context,
            code: E_MISSING_FIELD,
            reason: `Missing required field: '${opts.fieldName}'`,
            suggestion: opts.suggestion,
            data: { fieldName: opts.fieldName },
        });
    }
}

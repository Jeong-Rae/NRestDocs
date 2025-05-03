import { CoreError } from "./core-error";

/**
 * InvalidTypeError constructor parameters.
 */
interface InvalidTypeErrorParams {
    context: string;
    /** field name (optional, for the whole value) */
    fieldName?: string;
    /** expected type description */
    expected: string;
    /** actual value passed */
    actual: unknown;
}

/**
 * error code for invalid type error
 */
export const E_INVALID_TYPE = "E_INVALID_TYPE";

/**
 * error thrown when a value does not match the expected type
 * (e.g. unsafe filename, wrong descriptor type, etc.).
 */
export class InvalidTypeError extends CoreError {
    constructor(p: InvalidTypeErrorParams) {
        const reason = p.fieldName
            ? `Invalid type for field '${p.fieldName}': expected '${p.expected}', got '${String(p.actual)}'`
            : `Invalid type: expected '${p.expected}', got '${String(p.actual)}'`;

        const suggestion = p.fieldName
            ? `Ensure '${p.fieldName}' is of type '${p.expected}' before calling this method.`
            : `Pass a value compatible with '${p.expected}'.`;

        super({
            context: p.context,
            code: E_INVALID_TYPE,
            reason,
            suggestion,
            data: {
                expected: p.expected,
                actual: p.actual,
                fieldName: p.fieldName,
            },
        });
    }
}

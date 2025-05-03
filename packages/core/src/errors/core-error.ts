/**
 * base class for all custom errors in the project.
 *
 * Provides a common structure for all runtime errors in NRestDocs.
 * It separates a *reason* (what went wrong) and a *suggestion*
 * (how the user can fix it).
 *
 * @remarks
 * - `context` is the identifier of the module, method, file, etc. where the error occurred.
 * - `reason` is the core message that the user needs to know.
 * - `suggestion` is the action guide that the user needs to take to fix the problem.
 * - `data` can contain arbitrary additional information for debugging.
 * - `code` is a string for error category identification.
 */
export interface CoreErrorOptions {
    /** identifier of the location, method, file, etc. where the error occurred */
    context: string;
    /** core message that the user needs to know */
    reason: string;
    /** action guide that the user needs to take to fix the problem */
    suggestion: string;
    /** additional metadata for debugging (optional) */
    data?: Record<string, unknown>;
    /** error code (optional, e.g. E_INVALID_TYPE) */
    code?: string;
}

/**
 * base class for all custom errors in the project.
 *
 * All custom errors in the project should extend this class so that
 * they expose a consistent JSON structure and user‑friendly message.
 */
export class CoreError extends Error {
    /** location, method, file, etc. where the error occurred */
    readonly context: string;
    /** core message that the user needs to know */
    readonly reason: string;
    /** action guide that the user needs to take to fix the problem */
    readonly suggestion: string;
    /** additional metadata for debugging (optional) */
    readonly data?: Record<string, unknown>;
    /** error code (optional, e.g. E_INVALID_TYPE) */
    readonly code?: string;

    constructor(opts: CoreErrorOptions) {
        const message = `${opts.reason}\n` + `How to fix: ${opts.suggestion}`;

        super(message);

        this.name = new.target.name; // keep the subclass name
        this.context = opts.context;
        this.reason = opts.reason;
        this.suggestion = opts.suggestion;
        this.data = opts.data;
        this.code = opts.code;
    }

    /**
     * specify the serialization format when JSON.stringify is called.
     * it can ensure structured data for logging/transmission.
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            context: this.context,
            reason: this.reason,
            suggestion: this.suggestion,
            data: this.data,
            stack: this.stack,
        };
    }
}

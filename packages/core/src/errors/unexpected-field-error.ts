import { CoreError } from "./core-error";

/**
 * error code for UnexpectedFieldError
 */
export const E_UNEXPECTED_FIELD = "E_UNEXPECTED_FIELD";

export type UnexpectedFieldErrorOptions = {
    context: string;
    extraFields: readonly string[];
};

export class UnexpectedFieldError extends CoreError {
    readonly extraFields: readonly string[];

    constructor({ context, extraFields }: UnexpectedFieldErrorOptions) {
        const fieldList = extraFields.join("', '");
        super({
            context,
            code: E_UNEXPECTED_FIELD,
            reason: `Unexpected field(s) detected: '${fieldList}'`,
            suggestion: "Remove the unexpected field(s) or update the schema to allow them.",
            data: { extraFields },
        });

        this.extraFields = extraFields;
    }
}

/**
 * 필수 필드가 누락되었을 때 발생하는 오류
 */
export interface MissingFieldErrorOptions {
    context: string;
    message: string;
    fieldName: string;
}

export class MissingFieldError extends Error {
    public readonly context: string;
    public readonly fieldName: string;

    constructor(options: MissingFieldErrorOptions | string) {
        if (typeof options === "string") {
            super(options);
            this.context = "";
            this.fieldName = "";
        } else {
            const { context, message, fieldName } = options;
            const detailedMessage = `${message}: '${fieldName}'`;

            super(detailedMessage);
            this.context = context;
            this.fieldName = fieldName;
        }

        this.name = "MissingFieldError";
    }
}

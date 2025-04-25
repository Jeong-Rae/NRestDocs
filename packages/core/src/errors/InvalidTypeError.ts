/**
 * 타입 검증 실패 시 발생하는 오류
 */
export interface InvalidTypeErrorOptions {
    context: string;
    message: string;
    expected: string;
    actual: string;
    fieldName?: string;
}

export class InvalidTypeError extends Error {
    public readonly context: string;
    public readonly expected: string;
    public readonly actual: string;
    public readonly fieldName?: string;

    constructor(options: InvalidTypeErrorOptions | string) {
        if (typeof options === "string") {
            super(options);
            this.context = "";
            this.expected = "";
            this.actual = "";
        } else {
            const { context, message, expected, actual, fieldName } = options;
            const detailedMessage = fieldName
                ? `${message}: field '${fieldName}' expected type '${expected}', but got '${actual}'`
                : `${message}: expected '${expected}', but got '${actual}'`;

            super(detailedMessage);
            this.context = context;
            this.expected = expected;
            this.actual = actual;
            this.fieldName = fieldName;
        }

        this.name = "InvalidTypeError";
    }
}

/**
 * 정의되지 않은 추가 필드가 존재할 때 발생하는 오류
 */
export interface UnexpectedFieldErrorOptions {
    context: string;
    message: string;
    extraFields: string[];
}

export class UnexpectedFieldError extends Error {
    public readonly context: string;
    public readonly extraFields: string[];

    constructor(options: UnexpectedFieldErrorOptions | string) {
        if (typeof options === "string") {
            super(options);
            this.context = "";
            this.extraFields = [];
        } else {
            const { context, message, extraFields } = options;
            const fieldList = extraFields.join("', '");
            const detailedMessage = `${message}: '${fieldList}'`;

            super(detailedMessage);
            this.context = context;
            this.extraFields = extraFields;
        }

        this.name = "UnexpectedFieldError";
    }
}

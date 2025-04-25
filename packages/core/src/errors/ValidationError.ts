/**
 * ValidationError 클래스는 여러 검증 오류를 하나로 묶어서 표현합니다.
 */
export interface ValidationErrorOptions {
    context: string;
    message: string;
    errors: Error[];
    summary?: string;
}

export class ValidationError extends Error {
    public readonly context: string;
    public readonly errors: Error[];
    public readonly summary: string;

    constructor(options: ValidationErrorOptions) {
        super(options.message);
        this.name = "ValidationError";
        this.context = options.context;
        this.errors = options.errors;
        this.summary = options.summary || "";
    }

    public getDetailedMessage(): string {
        return `${this.message}\n${this.summary}`;
    }
}

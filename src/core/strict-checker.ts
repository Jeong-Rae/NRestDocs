import { FieldDescriptor } from "../types/descriptors";
import { isString, isBoolean, isNil } from "es-toolkit";
import { isNumber, isObjectLike, isArray } from "es-toolkit/compat";
import { InvalidTypeError } from "../errors/InvalidTypeError";
import { UnexpectedFieldError } from "../errors/UnexpectedFieldError";
import { MissingFieldError } from "../errors/MissingFieldError";
import { ValidationError } from "../errors/ValidationError";

/**
 * StrictChecker는 request 또는 response의 실제 데이터와
 * 문서화 시 제공한 필드 정의(FieldDescriptor[])가 일치하는지 검사합니다.
 */
export class StrictChecker {
    /**
     * 실제 데이터와 필드 정의가 일치하는지 비동기적으로 검증합니다.
     * 모든 유효성 검사를 수행하고 발생한 모든 오류를 수집하여 보고합니다.
     *
     * @param context 검사 컨텍스트(request 또는 response)
     * @param actualBody 실제 데이터 객체
     * @param fields 필드 정의 목록
     * @throws 검증 실패 시 ValidationError 발생
     */
    public async check(
        context: "request" | "response",
        actualBody: any,
        fields: FieldDescriptor[]
    ): Promise<void> {
        const errors: Error[] = [];

        // 객체 타입 검증
        try {
            await this.ensureObject(actualBody, context);
        } catch (error) {
            errors.push(error as Error);
            if (errors.length > 0) {
                this.throwValidationErrors(errors, context);
            }
            return;
        }

        // 추가 필드 검증
        try {
            await this.ensureNoExtraFields(actualBody, fields, context);
        } catch (error) {
            errors.push(error as Error);
        }

        // 각 필드의 타입 유효성 검사
        const fieldValidationResults = await Promise.allSettled(
            fields.map((field) =>
                this.validateField(field, actualBody[field.name], context)
            )
        );

        // 실패한 검증에서 오류 수집
        fieldValidationResults.forEach((result) => {
            if (result.status === "rejected") {
                errors.push(result.reason);
            }
        });

        // 수집된 모든 오류를 출력
        if (errors.length > 0) {
            this.throwValidationErrors(errors, context);
        }
    }

    /**
     * 값이 객체인지 확인합니다.
     * 배열이나 null, undefined는 객체로 취급하지 않습니다.
     *
     * @param value 검사할 값
     * @param context 검사 컨텍스트(request 또는 response)
     * @throws 값이 객체가 아닌 경우 InvalidTypeError 발생
     */
    private async ensureObject(value: any, context: string): Promise<void> {
        const isValidObject =
            isObjectLike(value) && !isArray(value) && !isNil(value);

        if (!isValidObject) {
            const actualType = await this.prettyType(value);
            throw new InvalidTypeError({
                context,
                message: `${context} body must be a non-null object`,
                expected: "object",
                actual: actualType,
            });
        }
    }

    /**
     * 정의되지 않은 추가 필드가 존재하는지 확인합니다.
     *
     * @param actualBody 검사할 실제 데이터 객체
     * @param fields 필드 정의 목록
     * @param context 검사 컨텍스트(request 또는 response)
     * @throws 정의되지 않은 필드가 존재할 경우 UnexpectedFieldError 발생
     */
    private async ensureNoExtraFields(
        actualBody: Record<string, any>,
        fields: FieldDescriptor[],
        context: string
    ): Promise<void> {
        const definedKeys = new Set(fields.map(({ name }) => name));

        // 모든 키가 정의된 필드인지 확인
        const extraKeys = Object.keys(actualBody).filter(
            (key) => !definedKeys.has(key)
        );

        if (extraKeys.length > 0) {
            throw new UnexpectedFieldError({
                context,
                message: `${context} contains undocumented field(s)`,
                extraFields: extraKeys,
            });
        }
    }

    /**
     * 개별 필드의 유효성을 검사합니다.
     * 필수 필드가 누락되었는지, 타입이 일치하는지 확인합니다.
     *
     * @param field 필드 정의
     * @param value 실제 필드 값
     * @param context 검사 컨텍스트(request 또는 response)
     * @throws 필드가 필수인데 누락되었거나 타입이 일치하지 않을 경우 오류 발생
     */
    private async validateField(
        field: FieldDescriptor,
        value: any,
        context: string
    ): Promise<void> {
        const { name: fieldName, type, optional } = field;

        // 값이 없는 경우: 선택적 필드가 아니면 오류 발생
        if (value === undefined) {
            if (!optional) {
                throw new MissingFieldError({
                    context,
                    message: `${context} is missing a required field`,
                    fieldName,
                });
            }
            return; // 선택적 필드면 검증 종료
        }

        // 타입 검사
        if (!(await this.matchesType(type, value))) {
            const actualType = await this.prettyType(value);
            throw new InvalidTypeError({
                context,
                message: `${context} field has incorrect type`,
                fieldName,
                expected: type,
                actual: actualType,
            });
        }
    }

    /**
     * 예상 타입(type 문자열)과 실제 값(value)이 일치하는지 검사합니다.
     *
     * @param expected 예상 타입 문자열 ("string", "number" 등)
     * @param value 실제 값
     * @returns 타입이 일치하면 true, 그렇지 않으면 false
     */
    private async matchesType(expected: string, value: any): Promise<boolean> {
        switch (expected) {
            case "string":
                return isString(value);
            case "number":
                return isNumber(value);
            case "boolean":
                return isBoolean(value);
            case "object":
                return isObjectLike(value) && !isArray(value) && !isNil(value);
            case "array":
                return isArray(value);
            default:
                return typeof value === expected;
        }
    }

    /**
     * 디버깅용 타입 이름을 사람이 읽기 쉬운 형태로 반환합니다.
     *
     * @param value 타입을 표시할 값
     * @returns 값의 타입을 나타내는 문자열
     */
    private async prettyType(value: any): Promise<string> {
        if (isNil(value)) return "null";
        if (isArray(value)) return "array";
        if (isString(value)) return "string";
        if (isNumber(value)) return "number";
        if (isBoolean(value)) return "boolean";
        if (isObjectLike(value)) return "object";
        return typeof value;
    }

    /**
     * 수집된 모든 검증 오류를 하나의 ValidationError로 묶어서 던집니다.
     *
     * @param errors 수집된 오류 목록
     * @param context 검사 컨텍스트(request 또는 response)
     * @throws ValidationError
     */
    private throwValidationErrors(errors: Error[], context: string): never {
        const errorCount = errors.length;
        const errorSummary = errors.map((err) => err.message).join("\n- ");

        throw new ValidationError({
            context,
            message: `${context} validation failed with ${errorCount} error(s)`,
            errors,
            summary: `- ${errorSummary}`,
        });
    }
}

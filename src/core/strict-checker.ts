import { isNil } from "es-toolkit";
import { isArray, isObjectLike } from "es-toolkit/compat";

import {
    InvalidTypeError,
    MissingFieldError,
    UnexpectedFieldError,
    ValidationError,
} from "../errors";
import { FieldDescriptor } from "../types";

import { matchesType, prettyType } from "./utils/type-checker";

export class StrictChecker {
    /**
     * 실제 데이터와 필드 정의가 일치하는지 검증합니다.
     * 모든 유효성 검사를 수행하고 발생한 모든 오류를 수집하여 보고합니다.
     *
     * @param context 검사 컨텍스트(request 또는 response)
     * @param actualBody 실제 데이터 객체
     * @param fields 필드 정의 목록
     * @throws 검증 실패 시 ValidationError 발생
     */
    public async check(
        context: "request" | "response",
        actualBody: unknown,
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
        }

        // 추가 필드 검증
        try {
            await this.ensureNoExtraFields(actualBody as Record<string, unknown>, fields, context);
        } catch (error) {
            errors.push(error as Error);
        }

        // 각 필드의 타입 유효성 검사
        const fieldValidationResults = await Promise.allSettled(
            fields.map((field) =>
                this.validateField(
                    field,
                    (actualBody as Record<string, unknown>)[field.name],
                    context
                )
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
    private async ensureObject(value: unknown, context: string): Promise<void> {
        const isValidObject = isObjectLike(value) && !isArray(value) && !isNil(value);

        if (!isValidObject) {
            const actualType = prettyType(value);
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
        actualBody: Record<string, unknown>,
        fields: FieldDescriptor[],
        context: string
    ): Promise<void> {
        const definedKeys = new Set(fields.map(({ name }) => name));

        // 모든 키가 정의된 필드인지 확인
        const extraKeys = Object.keys(actualBody).filter((key) => !definedKeys.has(key));

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
        value: unknown,
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
            return;
        }

        if (!matchesType(type, value)) {
            const actualType = prettyType(value);
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
     * 수집된 모든 검증 오류를 하나의 ValidationError로 묶어서 던집니다.
     *
     * @param errors 수집된 오류 목록
     * @param context 검사 컨텍스트(request 또는 response)
     */
    private throwValidationErrors(errors: Error[], context: string): never {
        throw new ValidationError({
            context,
            message: `${context} validation failed`,
            errors,
        });
    }
}

import { describe, expect, it } from "vitest";

import {
    InvalidTypeError,
    MissingFieldError,
    UnexpectedFieldError,
    ValidationError,
} from "../errors";

import { StrictChecker } from "./strict-checker";

import type { FieldDescriptor } from "../types";

describe("StrictChecker", () => {
    const checker = new StrictChecker();

    describe("check", () => {
        it("유효한 데이터와 필드 정의가 일치하면 오류를 발생시키지 않아야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = { name: "test", age: 30, active: true };
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string" },
                { name: "age", type: "number" },
                { name: "active", type: "boolean" },
            ];

            // When & Then
            await expect(checker.check(context, actualBody, fields)).resolves.toBeUndefined();
        });

        it("선택적 필드가 누락되어도 오류를 발생시키지 않아야 한다", async () => {
            // Given
            const context = "response";
            const actualBody = { id: 123 };
            const fields: FieldDescriptor[] = [
                { name: "id", type: "number" },
                { name: "description", type: "string", optional: true },
            ];

            // When & Then
            await expect(checker.check(context, actualBody, fields)).resolves.toBeUndefined();
        });

        it("body가 객체가 아니면 InvalidTypeError를 발생시켜야 한다 (null)", async () => {
            // Given
            const context = "request";
            const actualBody = null;
            const fields: FieldDescriptor[] = [{ name: "name", type: "string" }];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.message).toContain("request validation failed");
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(InvalidTypeError);
                expect(innerError.message).toContain("request body must be a non-null object");
                expect((innerError as InvalidTypeError).expected).toBe("object");
                expect((innerError as InvalidTypeError).actual).toBe("null");
            }
        });

        it("body가 객체가 아니면 InvalidTypeError를 발생시켜야 한다 (array)", async () => {
            // Given
            const context = "response";
            const actualBody = [1, 2, 3];
            const fields: FieldDescriptor[] = [{ name: "id", type: "number" }];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(InvalidTypeError);
                expect((innerError as InvalidTypeError).actual).toBe("array");
            }
        });

        it("필수 필드가 누락되면 MissingFieldError를 발생시켜야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = { age: 30 };
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string" },
                { name: "age", type: "number" },
            ];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(MissingFieldError);
                expect(innerError.message).toContain("missing a required field");
                expect((innerError as MissingFieldError).fieldName).toBe("name");
            }
        });

        it("필드 타입이 일치하지 않으면 InvalidTypeError를 발생시켜야 한다", async () => {
            // Given
            const context = "response";
            const actualBody = { id: "123" };
            const fields: FieldDescriptor[] = [{ name: "id", type: "number" }];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(InvalidTypeError);
                expect(innerError.message).toContain("field has incorrect type");
                expect((innerError as InvalidTypeError).fieldName).toBe("id");
                expect((innerError as InvalidTypeError).expected).toBe("number");
                expect((innerError as InvalidTypeError).actual).toBe("string");
            }
        });

        it("정의되지 않은 필드가 포함되면 UnexpectedFieldError를 발생시켜야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = { name: "test", extraField: "unexpected" };
            const fields: FieldDescriptor[] = [{ name: "name", type: "string" }];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(UnexpectedFieldError);
                expect(innerError.message).toContain("undocumented field(s)");
                expect((innerError as UnexpectedFieldError).extraFields).toEqual(["extraField"]);
            }
        });

        it("여러 종류의 오류가 발생하면 모든 오류를 포함하는 ValidationError를 발생시켜야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = { age: "30", extra: true };
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string" },
                { name: "age", type: "number" },
            ];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(3);
                expect(validationError.errors.some((e) => e instanceof UnexpectedFieldError)).toBe(
                    true
                );
                expect(validationError.errors.some((e) => e instanceof MissingFieldError)).toBe(
                    true
                );
                expect(validationError.errors.some((e) => e instanceof InvalidTypeError)).toBe(
                    true
                );

                const unexpectedError = validationError.errors.find(
                    (e) => e instanceof UnexpectedFieldError
                ) as UnexpectedFieldError;
                expect(unexpectedError.extraFields).toEqual(["extra"]);

                const missingError = validationError.errors.find(
                    (e) => e instanceof MissingFieldError
                ) as MissingFieldError;
                expect(missingError.fieldName).toBe("name");

                const invalidTypeError = validationError.errors.find(
                    (e) => e instanceof InvalidTypeError
                ) as InvalidTypeError;
                expect(invalidTypeError.fieldName).toBe("age");
                expect(invalidTypeError.expected).toBe("number");
                expect(invalidTypeError.actual).toBe("string");
            }
        });

        it("빈 객체와 빈 필드 정의는 오류를 발생시키지 않아야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = {};
            const fields: FieldDescriptor[] = [];

            // When & Then
            await expect(checker.check(context, actualBody, fields)).resolves.toBeUndefined();
        });

        it("빈 객체에 대해 필드가 정의되어 있으면 MissingFieldError를 발생시켜야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = {};
            const fields: FieldDescriptor[] = [{ name: "name", type: "string" }];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(MissingFieldError);
                expect((innerError as MissingFieldError).fieldName).toBe("name");
            }
        });

        it("실제 데이터가 있으나 필드 정의가 비어있으면 UnexpectedFieldError를 발생시켜야 한다", async () => {
            // Given
            const context = "request";
            const actualBody = { name: "test" };
            const fields: FieldDescriptor[] = [];

            // When & Then
            try {
                await checker.check(context, actualBody, fields);
                expect.fail("ValidationError가 발생해야 합니다.");
            } catch (error) {
                expect(error).toBeInstanceOf(ValidationError);
                const validationError = error as ValidationError;
                expect(validationError.errors).toHaveLength(1);
                const innerError = validationError.errors[0];
                expect(innerError).toBeInstanceOf(UnexpectedFieldError);
                expect((innerError as UnexpectedFieldError).extraFields).toEqual(["name"]);
            }
        });
    });
});

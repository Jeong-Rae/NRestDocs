import { describe, expect, it } from "vitest";

import { InvalidTypeError } from "./InvalidTypeError";

describe("InvalidTypeError", () => {
    describe("문자열 옵션으로 생성", () => {
        it("기본 메시지로 에러를 생성한다", () => {
            // Given
            const message = "타입 검증 실패";

            // When
            const error = new InvalidTypeError(message);

            // Then
            expect(error).toBeInstanceOf(InvalidTypeError);
            expect(error.name).toBe("InvalidTypeError");
            expect(error.message).toBe(message);
            expect(error.context).toBe("");
            expect(error.expected).toBe("");
            expect(error.actual).toBe("");
            expect(error.fieldName).toBeUndefined();
        });
    });

    describe("객체 옵션으로 생성", () => {
        it("필드명이 없는 경우 상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "타입 검증 실패",
                expected: "string",
                actual: "number",
            };

            // When
            const error = new InvalidTypeError(options);

            // Then
            expect(error).toBeInstanceOf(InvalidTypeError);
            expect(error.name).toBe("InvalidTypeError");
            expect(error.message).toBe("타입 검증 실패: expected 'string', but got 'number'");
            expect(error.context).toBe("request");
            expect(error.expected).toBe("string");
            expect(error.actual).toBe("number");
            expect(error.fieldName).toBeUndefined();
        });

        it("필드명이 있는 경우 상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "타입 검증 실패",
                expected: "string",
                actual: "number",
                fieldName: "username",
            };

            // When
            const error = new InvalidTypeError(options);

            // Then
            expect(error).toBeInstanceOf(InvalidTypeError);
            expect(error.name).toBe("InvalidTypeError");
            expect(error.message).toBe(
                "타입 검증 실패: field 'username' expected type 'string', but got 'number'"
            );
            expect(error.context).toBe("request");
            expect(error.expected).toBe("string");
            expect(error.actual).toBe("number");
            expect(error.fieldName).toBe("username");
        });
    });
});

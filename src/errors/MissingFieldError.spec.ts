import { describe, expect, it } from "vitest";

import { MissingFieldError } from "./MissingFieldError";

describe("MissingFieldError", () => {
    describe("문자열 옵션으로 생성", () => {
        it("기본 메시지로 에러를 생성한다", () => {
            // Given
            const message = "필수 필드 누락";

            // When
            const error = new MissingFieldError(message);

            // Then
            expect(error).toBeInstanceOf(MissingFieldError);
            expect(error.name).toBe("MissingFieldError");
            expect(error.message).toBe(message);
            expect(error.context).toBe("");
            expect(error.fieldName).toBe("");
        });
    });

    describe("객체 옵션으로 생성", () => {
        it("상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "필수 필드 누락",
                fieldName: "username",
            };

            // When
            const error = new MissingFieldError(options);

            // Then
            expect(error).toBeInstanceOf(MissingFieldError);
            expect(error.name).toBe("MissingFieldError");
            expect(error.message).toBe("필수 필드 누락: 'username'");
            expect(error.context).toBe("request");
            expect(error.fieldName).toBe("username");
        });
    });
});

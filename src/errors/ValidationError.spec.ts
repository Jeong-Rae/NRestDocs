import { describe, expect, it } from "vitest";

import { ValidationError } from "./ValidationError";

describe("ValidationError", () => {
    describe("summary가 없는 경우", () => {
        it("기본 메시지로 에러를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "검증 실패",
                errors: [new Error("에러 1"), new Error("에러 2")],
            };

            // When
            const error = new ValidationError(options);

            // Then
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.name).toBe("ValidationError");
            expect(error.message).toBe("검증 실패");
            expect(error.context).toBe("request");
            expect(error.errors).toEqual([new Error("에러 1"), new Error("에러 2")]);
            expect(error.summary).toBe("");
            expect(error.getDetailedMessage()).toBe("검증 실패\n");
        });
    });

    describe("summary가 있는 경우", () => {
        it("상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "검증 실패",
                errors: [new Error("에러 1"), new Error("에러 2")],
                summary: "2개의 에러가 발생했습니다.",
            };

            // When
            const error = new ValidationError(options);

            // Then
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.name).toBe("ValidationError");
            expect(error.message).toBe("검증 실패");
            expect(error.context).toBe("request");
            expect(error.errors).toEqual([new Error("에러 1"), new Error("에러 2")]);
            expect(error.summary).toBe("2개의 에러가 발생했습니다.");
            expect(error.getDetailedMessage()).toBe("검증 실패\n2개의 에러가 발생했습니다.");
        });
    });
});

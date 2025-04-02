import { describe, expect, it } from "vitest";

import { UnexpectedFieldError } from "./UnexpectedFieldError";

describe("UnexpectedFieldError", () => {
    describe("문자열 옵션으로 생성", () => {
        it("기본 메시지로 에러를 생성한다", () => {
            // Given
            const message = "정의되지 않은 필드 존재";

            // When
            const error = new UnexpectedFieldError(message);

            // Then
            expect(error).toBeInstanceOf(UnexpectedFieldError);
            expect(error.name).toBe("UnexpectedFieldError");
            expect(error.message).toBe(message);
            expect(error.context).toBe("");
            expect(error.extraFields).toEqual([]);
        });
    });

    describe("객체 옵션으로 생성", () => {
        it("단일 필드에 대한 상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "정의되지 않은 필드 존재",
                extraFields: ["username"],
            };

            // When
            const error = new UnexpectedFieldError(options);

            // Then
            expect(error).toBeInstanceOf(UnexpectedFieldError);
            expect(error.name).toBe("UnexpectedFieldError");
            expect(error.message).toBe("정의되지 않은 필드 존재: 'username'");
            expect(error.context).toBe("request");
            expect(error.extraFields).toEqual(["username"]);
        });

        it("여러 필드에 대한 상세 메시지를 생성한다", () => {
            // Given
            const options = {
                context: "request",
                message: "정의되지 않은 필드 존재",
                extraFields: ["username", "email", "age"],
            };

            // When
            const error = new UnexpectedFieldError(options);

            // Then
            expect(error).toBeInstanceOf(UnexpectedFieldError);
            expect(error.name).toBe("UnexpectedFieldError");
            expect(error.message).toBe("정의되지 않은 필드 존재: 'username', 'email', 'age'");
            expect(error.context).toBe("request");
            expect(error.extraFields).toEqual(["username", "email", "age"]);
        });
    });
});

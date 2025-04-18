import { describe, expect, it } from "vitest";

import { format } from "./format";

describe("format", () => {
    describe("format", () => {
        it("템플릿 리터럴을 처리할 수 있다", () => {
            // Given
            const method = "POST";
            const path = "/api/users";

            // When
            const result = format`
== Overview
HTTP Method:: \`${method}\`
URL Path:: \`${path}\`
`;

            // Then
            expect(result).toBe("\n== Overview\nHTTP Method:: `POST`\nURL Path:: `/api/users`\n");
        });

        it("값이 없는 경우 빈 문자열을 사용한다", () => {
            // Given
            const value = undefined;

            // When
            const result = format`
Hello ${value}!
`;

            // Then
            expect(result).toBe("\nHello !\n");
        });
    });
});

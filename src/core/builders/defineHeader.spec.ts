import { describe, expect, it } from "vitest";

import { defineHeader } from "./defineHeader";

describe("defineHeader", () => {
    describe("defineHeader", () => {
        it("기본 헤더 descriptor를 생성한다", () => {
            // Given
            const name = "Content-Type";

            // When
            const result = defineHeader(name);

            // Then
            expect(result).toBeDefined();
            expect(typeof result.description).toBe("function");
            expect(typeof result.optional).toBe("function");
            expect(typeof result.toDescriptor).toBe("function");
        });

        it("헤더 descriptor를 완성할 수 있다", () => {
            // Given
            const name = "Authorization";

            // When
            const descriptor = defineHeader(name)
                .description("인증 토큰")
                .optional()
                .toDescriptor();

            // Then
            expect(descriptor).toEqual({
                name: "Authorization",
                type: "string",
                description: "인증 토큰",
                optional: true,
            });
        });
    });
});

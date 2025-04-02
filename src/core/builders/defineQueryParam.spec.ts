import { describe, expect, it } from "vitest";

import { defineQueryParam } from "./defineQueryParam";

describe("defineQueryParam", () => {
    describe("defineQueryParam", () => {
        it("기본 쿼리 파라미터 descriptor를 생성한다", () => {
            // Given
            const name = "page";

            // When
            const result = defineQueryParam(name);

            // Then
            expect(result).toBeDefined();
            expect(typeof result.type).toBe("function");
        });

        it("쿼리 파라미터 descriptor를 완성할 수 있다", () => {
            // Given
            const name = "search";

            // When
            const descriptor = defineQueryParam(name)
                .type("string")
                .description("검색 키워드")
                .optional()
                .toDescriptor();

            // Then
            expect(descriptor).toEqual({
                name: "search",
                type: "string",
                description: "검색 키워드",
                optional: true,
            });
        });
    });
});

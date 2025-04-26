import { describe, expect, it } from "vitest";

import { definePathParam } from "./definePathParam";

describe("definePathParam", () => {
    describe("definePathParam", () => {
        it("기본 경로 파라미터 descriptor를 생성한다", () => {
            // Given
            const name = "userId";

            // When
            const result = definePathParam(name);

            // Then
            expect(result).toBeDefined();
            expect(typeof result.type).toBe("function");
        });

        it("경로 파라미터 descriptor를 완성할 수 있다", () => {
            // Given
            const name = "postId";

            // When
            const descriptor = definePathParam(name)
                .type("number")
                .description("게시글 ID")
                .optional()
                .toDescriptor();

            // Then
            expect(descriptor).toEqual({
                name: "postId",
                type: "number",
                description: "게시글 ID",
                optional: true,
            });
        });
    });
});

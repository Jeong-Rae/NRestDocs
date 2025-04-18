import { describe, expect, it } from "vitest";

import { definePart } from "./definePart";

describe("definePart", () => {
    describe("definePart", () => {
        it("기본 파트 descriptor를 생성한다", () => {
            // Given
            const name = "file";

            // When
            const result = definePart(name);

            // Then
            expect(result).toBeDefined();
            expect(typeof result.type).toBe("function");
        });

        it("파트 descriptor를 완성할 수 있다", () => {
            // Given
            const name = "avatar";

            // When
            const descriptor = definePart(name)
                .type("file")
                .description("프로필 이미지")
                .optional()
                .toDescriptor();

            // Then
            expect(descriptor).toEqual({
                name: "avatar",
                type: "file",
                description: "프로필 이미지",
                optional: true,
            });
        });
    });
});

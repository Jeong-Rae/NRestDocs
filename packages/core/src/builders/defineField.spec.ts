import { describe, expect, it } from "vitest";

import { defineField } from "./defineField";

describe("defineField", () => {
    describe("defineField", () => {
        it("기본 필드 descriptor를 생성한다", () => {
            // Given
            const name = "username";

            // When
            const result = defineField(name);

            // Then
            expect(result).toBeDefined();
            expect(typeof result.type).toBe("function");
        });

        it("필드 descriptor를 완성할 수 있다", () => {
            // Given
            const name = "age";

            // When
            const descriptor = defineField(name)
                .type("number")
                .description("사용자 나이")
                .optional()
                .toDescriptor();

            // Then
            expect(descriptor).toEqual({
                name: "age",
                type: "number",
                description: "사용자 나이",
                optional: true,
            });
        });
    });
});

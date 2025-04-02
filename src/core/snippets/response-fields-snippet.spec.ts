import { describe, expect, it } from "vitest";

import { generateResponseFieldsSnippet } from "./response-fields-snippet";

import type { FieldDescriptor } from "../../types";

describe("response-fields-snippet", () => {
    describe("generateResponseFieldsSnippet", () => {
        it("필수 필드만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "id", type: "number", optional: false, description: "생성된 ID" },
            ];

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +id+ | +number+ | +false+ | 생성된 ID");
        });

        it("선택적 필드만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string", optional: true, description: "이름" },
            ];

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +name+ | +string+ | +true+ | 이름");
        });

        it("필수 필드와 선택적 필드가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "id", type: "number", optional: false, description: "생성된 ID" },
                {
                    name: "createdAt",
                    type: "string",
                    optional: true,
                    description: "생성 시각 (선택)",
                },
            ];

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +id+ | +number+ | +false+ | 생성된 ID");
            expect(result).toContain("| +createdAt+ | +string+ | +true+ | 생성 시각 (선택)");
        });

        it("description이 없는 필드가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "id", type: "number", optional: false, description: undefined },
            ];
            const expectedRow = "| +id+ | +number+ | +false+ | ";

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("필드가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const fields: FieldDescriptor[] = [];

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toBe("");
        });
    });
});

import { describe, expect, it } from "vitest";

import { FieldDescriptor } from "../../types";

import { generateRequestFieldsSnippet } from "./request-fields-snippet";

describe("request-fields-snippet", () => {
    describe("generateRequestFieldsSnippet", () => {
        it("필수 필드만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string", optional: false, description: "이름" },
            ];

            // When
            const result = generateRequestFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +name+ | +string+ | +false+ | 이름");
        });

        it("선택적 필드만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                {
                    name: "age",
                    type: "number",
                    optional: true,
                    description: "나이",
                },
            ];

            // When
            const result = generateRequestFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +age+ | +number+ | +true+ | 나이");
        });

        it("필수 필드와 선택적 필드가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                { name: "name", type: "string", optional: false, description: "이름" },
                { name: "email", type: "string", optional: true, description: "이메일 (선택)" },
            ];

            // When
            const result = generateRequestFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +name+ | +string+ | +false+ | 이름");
            expect(result).toContain("| +email+ | +string+ | +true+ | 이메일 (선택)");
        });
    });
});

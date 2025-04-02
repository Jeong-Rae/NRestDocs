import { describe, expect, it } from "vitest";

import { FieldDescriptor } from "../../types";

import { generateRequestFieldsSnippet } from "./request-fields-snippet";

describe("request-fields-snippet", () => {
    describe("generateRequestFieldsSnippet", () => {
        it("필드가 있는 요청 필드 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                {
                    name: "name",
                    type: "string",
                    optional: false,
                    description: "사용자 이름",
                },
                {
                    name: "age",
                    type: "number",
                    optional: true,
                    description: "사용자 나이",
                },
            ];

            // When
            const result = generateRequestFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +name+ | +string+ | +false+ | 사용자 이름");
            expect(result).toContain("| +age+ | +number+ | +true+ | 사용자 나이");
        });
    });
});

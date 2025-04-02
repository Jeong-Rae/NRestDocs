import { describe, expect, it } from "vitest";

import { FieldDescriptor } from "../../types";

import { generateResponseFieldsSnippet } from "./response-fields-snippet";

describe("response-fields-snippet", () => {
    describe("generateResponseFieldsSnippet", () => {
        it("필드가 있는 응답 필드 스니펫을 생성한다", () => {
            // Given
            const fields: FieldDescriptor[] = [
                {
                    name: "id",
                    type: "string",
                    optional: false,
                    description: "사용자 ID",
                },
                {
                    name: "name",
                    type: "string",
                    optional: false,
                    description: "사용자 이름",
                },
                {
                    name: "email",
                    type: "string",
                    optional: true,
                    description: "사용자 이메일",
                },
            ];

            // When
            const result = generateResponseFieldsSnippet(fields);

            // Then
            expect(result).toContain("| +id+ | +string+ | +false+ | 사용자 ID");
            expect(result).toContain("| +name+ | +string+ | +false+ | 사용자 이름");
            expect(result).toContain("| +email+ | +string+ | +true+ | 사용자 이메일");
        });
    });
});

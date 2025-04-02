import { describe, expect, it } from "vitest";

import { ParameterDescriptor } from "../../types";

import { generateRequestParametersSnippet } from "./request-parameters-snippet";

describe("request-parameters-snippet.spec.ts", () => {
    describe("generateRequestParametersSnippet", () => {
        it("파라미터가 있는 요청 파라미터 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                {
                    name: "id",
                    type: "string",
                    optional: false,
                    description: "사용자 ID",
                },
                {
                    name: "type",
                    type: "string",
                    optional: true,
                    description: "사용자 타입",
                },
            ];

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            expect(result).toContain("| +id+ | +false+ | 사용자 ID");
            expect(result).toContain("| +type+ | +true+ | 사용자 타입");
        });
    });
});

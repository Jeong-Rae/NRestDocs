import { describe, expect, it } from "vitest";

import { ParameterDescriptor } from "../../types";

import { generatePathParametersSnippet } from "./path-parameters-snippet";

describe("path-parameters-snippet", () => {
    describe("generatePathParametersSnippet", () => {
        it("파라미터가 있는 경로 파라미터 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                {
                    name: "userId",
                    type: "string",
                    optional: false,
                    description: "사용자 ID",
                },
                {
                    name: "postId",
                    type: "string",
                    optional: false,
                    description: "게시물 ID",
                },
            ];

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toContain("| +userId+ | +false+ | 사용자 ID");
            expect(result).toContain("| +postId+ | +false+ | 게시물 ID");
        });
    });
});

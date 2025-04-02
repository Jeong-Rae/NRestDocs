import { describe, expect, it } from "vitest";

import { generatePathParametersSnippet } from "./path-parameters-snippet";

import type { ParameterDescriptor } from "../../types";

describe("path-parameters-snippet", () => {
    describe("generatePathParametersSnippet", () => {
        it("필수 파라미터만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                {
                    name: "userId",
                    type: "string",
                    optional: false,
                    description: "사용자 ID",
                },
            ];

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toContain("| +userId+ | +false+ | 사용자 ID");
        });

        it("선택적 파라미터만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                {
                    name: "page",
                    type: "number",
                    optional: true,
                    description: "페이지 번호",
                },
            ];

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toContain("| +page+ | +true+ | 페이지 번호");
        });

        it("필수 파라미터와 선택적 파라미터가 모두 있는 경우 스니펫을 생성한다", () => {
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
                    optional: true,
                    description: "게시물 ID (선택)",
                },
            ];

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toContain("| +userId+ | +false+ | 사용자 ID");
            expect(result).toContain("| +postId+ | +true+ | 게시물 ID (선택)");
        });

        it("description이 없는 파라미터가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                {
                    name: "userId",
                    type: "string",
                    optional: false,
                    description: undefined,
                },
            ];
            const expectedRow = "| +userId+ | +false+ | ";

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("파라미터가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const params: ParameterDescriptor[] = [];

            // When
            const result = generatePathParametersSnippet(params);

            // Then
            expect(result).toBe("");
        });
    });
});

import { describe, expect, it } from "vitest";

import { ParameterDescriptor } from "../../types";

import { generateRequestParametersSnippet } from "./request-parameters-snippet";

describe("request-parameters-snippet", () => {
    describe("generateRequestParametersSnippet", () => {
        it("필수 파라미터만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                { name: "id", type: "number", optional: false, description: "아이템 ID" },
            ];

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            // 실제 생성 형식: | +Name+ | +Optional+ | Description
            expect(result).toContain("| +id+ | +false+ | 아이템 ID");
        });

        it("선택적 파라미터만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                { name: "type", type: "string", optional: true, description: "타입 필터" },
            ];

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            expect(result).toContain("| +type+ | +true+ | 타입 필터");
        });

        it("필수 파라미터와 선택적 파라미터가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                { name: "id", type: "number", optional: false, description: "아이템 ID" },
                { name: "sort", type: "string", optional: true, description: "정렬 기준 (선택)" },
            ];

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            expect(result).toContain("| +id+ | +false+ | 아이템 ID");
            expect(result).toContain("| +sort+ | +true+ | 정렬 기준 (선택)");
        });

        it("description이 없는 파라미터가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const params: ParameterDescriptor[] = [
                { name: "page", type: "number", optional: true, description: undefined },
            ];
            const expectedRow = "| +page+ | +true+ | ";

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("파라미터가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const params: ParameterDescriptor[] = [];

            // When
            const result = generateRequestParametersSnippet(params);

            // Then
            expect(result).toBe("");
        });
    });
});

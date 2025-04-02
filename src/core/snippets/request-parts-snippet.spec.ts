import { describe, expect, it } from "vitest";

import { PartDescriptor } from "../../types";

import { generateRequestPartsSnippet } from "./request-parts-snippet";

describe("request-parts-snippet", () => {
    describe("generateRequestPartsSnippet", () => {
        it("필수 파트만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const parts: PartDescriptor[] = [
                { name: "file", type: "string", optional: false, description: "업로드 파일" },
            ];

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            // 실제 생성 형식: | +Name+ | +Optional+ | Description
            expect(result).toContain("| +file+ | +false+ | 업로드 파일");
        });

        it("선택적 파트만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const parts: PartDescriptor[] = [
                { name: "metadata", type: "string", optional: true, description: "메타데이터" },
            ];

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            expect(result).toContain("| +metadata+ | +true+ | 메타데이터");
        });

        it("필수 파트와 선택적 파트가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const parts: PartDescriptor[] = [
                { name: "file", type: "string", optional: false, description: "업로드 파일" },
                {
                    name: "thumbnail",
                    type: "string",
                    optional: true,
                    description: "썸네일 (선택)",
                },
            ];

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            expect(result).toContain("| +file+ | +false+ | 업로드 파일");
            expect(result).toContain("| +thumbnail+ | +true+ | 썸네일 (선택)");
        });

        it("description이 없는 파트가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const parts: PartDescriptor[] = [
                { name: "file", type: "string", optional: false, description: undefined },
            ];
            const expectedRow = "| +file+ | +false+ | ";

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("파트가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const parts: PartDescriptor[] = [];

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            expect(result).toBe("");
        });
    });
});

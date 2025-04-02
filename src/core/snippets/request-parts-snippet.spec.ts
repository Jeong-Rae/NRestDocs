import { describe, expect, it } from "vitest";

import { PartDescriptor } from "../../types";

import { generateRequestPartsSnippet } from "./request-parts-snippet";

describe("request-parts-snippet.spec.ts", () => {
    describe("generateRequestPartsSnippet", () => {
        it("파트가 있는 요청 파트 스니펫을 생성한다", () => {
            // Given
            const parts: PartDescriptor[] = [
                {
                    name: "file",
                    type: "file",
                    optional: false,
                    description: "업로드할 파일",
                },
                {
                    name: "metadata",
                    type: "string",
                    optional: true,
                    description: "파일 메타데이터",
                },
            ];

            // When
            const result = generateRequestPartsSnippet(parts);

            // Then
            expect(result).toContain("| +file+ | +false+ | 업로드할 파일");
            expect(result).toContain("| +metadata+ | +true+ | 파일 메타데이터");
        });
    });
});

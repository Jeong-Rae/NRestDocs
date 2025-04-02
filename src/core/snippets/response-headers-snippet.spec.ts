import { describe, expect, it } from "vitest";

import { HeaderDescriptor } from "../../types";

import { generateResponseHeadersSnippet } from "./response-headers-snippet";

describe("response-headers-snippet", () => {
    describe("generateResponseHeadersSnippet", () => {
        it("헤더가 있는 응답 헤더 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                {
                    name: "Content-Type",
                    type: "string",
                    optional: false,
                    description: "응답 본문의 미디어 타입",
                },
                {
                    name: "X-Request-ID",
                    type: "string",
                    optional: true,
                    description: "요청 추적 ID",
                },
            ];

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Type+ | +false+ | 응답 본문의 미디어 타입");
            expect(result).toContain("| +X-Request-ID+ | +true+ | 요청 추적 ID");
        });
    });
});

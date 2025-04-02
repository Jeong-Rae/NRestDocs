import { describe, expect, it } from "vitest";

import { HeaderDescriptor } from "../../types";

import { generateRequestHeadersSnippet } from "./request-headers-snippet";

describe("request-headers-snippet.spec.ts", () => {
    describe("generateRequestHeadersSnippet", () => {
        it("헤더가 있는 요청 헤더 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                {
                    name: "Content-Type",
                    type: "string",
                    optional: false,
                    description: "요청 본문의 미디어 타입",
                },
                {
                    name: "Authorization",
                    type: "string",
                    optional: true,
                    description: "인증 토큰",
                },
            ];

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Type+ | +false+ | 요청 본문의 미디어 타입");
            expect(result).toContain("| +Authorization+ | +true+ | 인증 토큰");
        });
    });
});

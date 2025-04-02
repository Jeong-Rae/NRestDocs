import { describe, expect, it } from "vitest";

import { HeaderDescriptor } from "../../types";

import { generateRequestHeadersSnippet } from "./request-headers-snippet";

describe("request-headers-snippet", () => {
    describe("generateRequestHeadersSnippet", () => {
        it("필수 헤더만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Content-Type", type: "string", optional: false, description: "요청 형식" },
            ];

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Type+ | +false+ | 요청 형식");
        });

        it("선택적 헤더만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Authorization", type: "string", optional: true, description: "인증 토큰" },
            ];

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Authorization+ | +true+ | 인증 토큰");
        });

        it("필수 헤더와 선택적 헤더가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Content-Type", type: "string", optional: false, description: "요청 형식" },
                { name: "Accept", type: "string", optional: true, description: "응답 형식 (선택)" },
            ];

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Type+ | +false+ | 요청 형식");
            expect(result).toContain("| +Accept+ | +true+ | 응답 형식 (선택)");
        });
    });
});

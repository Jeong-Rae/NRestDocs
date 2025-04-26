import { describe, expect, it } from "vitest";

import { generateRequestHeadersSnippet } from "./request-headers-snippet";

import type { HeaderDescriptor } from "@/types";

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

        it("description이 없는 헤더가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Content-Type", type: "string", optional: false, description: undefined },
            ];
            const expectedRow = "| +Content-Type+ | +false+ | ";

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("헤더가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [];

            // When
            const result = generateRequestHeadersSnippet(headers);

            // Then
            expect(result).toBe("");
        });
    });
});

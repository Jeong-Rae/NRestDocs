import { describe, expect, it } from "vitest";

import { generateResponseHeadersSnippet } from "./response-headers-snippet";

import type { HeaderDescriptor } from "../../types";

describe("response-headers-snippet", () => {
    describe("generateResponseHeadersSnippet", () => {
        it("필수 헤더만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                {
                    name: "Content-Length",
                    type: "string",
                    optional: false,
                    description: "본문 길이",
                },
            ];

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Length+ | +false+ | 본문 길이");
        });

        it("선택적 헤더만 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Location", type: "string", optional: true, description: "리디렉션 위치" },
            ];

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Location+ | +true+ | 리디렉션 위치");
        });

        it("필수 헤더와 선택적 헤더가 모두 있는 경우 스니펫을 생성한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Content-Type", type: "string", optional: false, description: "응답 형식" },
                { name: "ETag", type: "string", optional: true, description: "엔티티 태그 (선택)" },
            ];

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toContain("| +Content-Type+ | +false+ | 응답 형식");
            expect(result).toContain("| +ETag+ | +true+ | 엔티티 태그 (선택)");
        });

        it("description이 없는 헤더가 있는 경우 빈 문자열로 처리한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [
                { name: "Content-Length", type: "string", optional: false, description: undefined },
            ];
            const expectedRow = "| +Content-Length+ | +false+ | ";

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toContain(expectedRow);
        });

        it("헤더가 없는 경우 빈 문자열을 반환한다", () => {
            // Given
            const headers: HeaderDescriptor[] = [];

            // When
            const result = generateResponseHeadersSnippet(headers);

            // Then
            expect(result).toBe("");
        });
    });
});

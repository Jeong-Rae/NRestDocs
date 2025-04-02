import { describe, expect, it } from "vitest";

import { generateHttpResponseSnippet } from "./http-response-snippet";

import type { HttpHeaders } from "../../types";

describe("http-response-snippet", () => {
    describe("generateHttpResponseSnippet", () => {
        it("헤더가 있는 HTTP 응답 스니펫을 생성한다", () => {
            // Given
            const statusCode = 200;
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            };
            const body = {};

            // When
            const result = generateHttpResponseSnippet(statusCode, headers, body);

            // Then
            expect(result).toContain("Content-Type: application/json");
            expect(result).toContain("Cache-Control: no-cache");
        });

        it("body가 있는 HTTP 응답 스니펫을 생성한다", () => {
            // Given
            const statusCode = 200;
            const headers: HttpHeaders = {};
            const body = { data: "test" };

            // When
            const result = generateHttpResponseSnippet(statusCode, headers, body);

            // Then
            expect(result).toContain('"data": "test"');
        });
    });
});

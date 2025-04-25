import { describe, expect, it } from "vitest";

import { generateHttpRequestSnippet } from "./http-request-snippet";

import type { HttpHeaders, HttpMethod } from "@/types";

describe("http-request-snippet", () => {
    describe("generateHttpRequestSnippet", () => {
        it("헤더가 있는 HTTP 요청 스니펫을 생성한다", () => {
            // Given
            const method: HttpMethod = "GET";
            const url = new URL("https://api.example.com/users");
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
            };
            const body = {};

            // When
            const result = generateHttpRequestSnippet(method, url, headers, body);

            // Then
            expect(result).toContain("Content-Type: application/json");
            expect(result).toContain("Authorization: Bearer token123");
        });

        it("body가 있는 HTTP 요청 스니펫을 생성한다", () => {
            // Given
            const method: HttpMethod = "POST";
            const url = new URL("https://api.example.com/users");
            const headers: HttpHeaders = {};
            const body = { name: "John", age: 30 };

            // When
            const result = generateHttpRequestSnippet(method, url, headers, body);

            // Then
            expect(result).toContain('"name": "John"');
            expect(result).toContain('"age": 30');
        });
    });
});

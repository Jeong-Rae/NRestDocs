import { describe, expect, it } from "vitest";

import { HttpHeaders, HttpMethod } from "../../types";

import { generateCurlSnippet } from "./curl-snippet";

describe("curl-snippet.spec.ts", () => {
    describe("generateCurlSnippet", () => {
        it("헤더가 있는 curl 명령어를 생성한다", () => {
            // Given
            const method: HttpMethod = "GET";
            const url = new URL("https://api.example.com/users");
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
            };
            const body = {};

            // When
            const result = generateCurlSnippet(method, url, headers, body);

            // Then
            expect(result).toContain('-H "Content-Type: application/json"');
            expect(result).toContain('-H "Authorization: Bearer token123"');
        });

        it("body가 있는 curl 명령어를 생성한다", () => {
            // Given
            const method: HttpMethod = "POST";
            const url = new URL("https://api.example.com/users");
            const headers: HttpHeaders = {};
            const body = { name: "John", age: 30 };

            // When
            const result = generateCurlSnippet(method, url, headers, body);

            // Then
            expect(result).toContain('-d "{\\"name\\":\\"John\\",\\"age\\":30}"');
        });
    });
});

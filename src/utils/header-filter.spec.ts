import { describe, expect, it } from "vitest";

import { filterHeaders, filterRequestHeaders, filterResponseHeaders } from "./header-filter";

import type { HttpHeaders } from "../types";

describe("header-filter", () => {
    describe("filterHeaders", () => {
        it("허용된 헤더만 필터링하여 반환한다", () => {
            // Given
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
                "X-Custom-Header": "custom-value",
            };
            const allowedList = ["Content-Type", "Authorization"];

            // When
            const result = filterHeaders(headers, allowedList);

            // Then
            expect(result).toEqual({
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
            });
        });

        it("헤더 이름이 대소문자를 구분하지 않고 필터링한다", () => {
            // Given
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                authorization: "Bearer token123",
            };
            const allowedList = ["Content-Type", "Authorization"];

            // When
            const result = filterHeaders(headers, allowedList);

            // Then
            expect(result).toEqual({
                "Content-Type": "application/json",
                authorization: "Bearer token123",
            });
        });
    });

    describe("filterRequestHeaders", () => {
        it("기본 요청 헤더 whitelist로 필터링한다", () => {
            // Given
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
                "X-Custom-Header": "custom-value",
            };

            // When
            const result = filterRequestHeaders(headers);

            // Then
            expect(result).toHaveProperty("Content-Type");
            expect(result).toHaveProperty("Authorization");
            expect(result).not.toHaveProperty("X-Custom-Header");
        });
    });

    describe("filterResponseHeaders", () => {
        it("기본 응답 헤더 whitelist로 필터링한다", () => {
            // Given
            const headers: HttpHeaders = {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "X-Custom-Header": "custom-value",
            };

            // When
            const result = filterResponseHeaders(headers);

            // Then
            expect(result).toHaveProperty("Content-Type");
            expect(result).toHaveProperty("Cache-Control");
            expect(result).not.toHaveProperty("X-Custom-Header");
        });
    });
});

import { describe, expect, it } from "vitest";

import {
    filterHeadersByBlacklist,
    filterRequestHeaders,
    filterResponseHeaders,
} from "./header-filter";

describe("header-filter", () => {
    describe("filterHeadersByBlacklist", () => {
        it("블랙리스트에 있는 헤더를 제거하여 반환한다", () => {
            // Given
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer token519",
                "X-Custom-Header": "custom-value",
                ETag: 'W/"519"',
            };
            const blacklist = ["ETag", "X-Custom-Header"];

            // When
            const result = filterHeadersByBlacklist(headers, blacklist);

            // Then
            expect(result).toEqual({
                "Content-Type": "application/json",
                Authorization: "Bearer token519",
            });
        });

        it("헤더 이름이 대소문자를 구분하지 않고 블랙리스트로 제거한다", () => {
            // Given
            const headers = {
                "Content-Type": "application/json",
                authorization: "Bearer token519",
                eTag: 'W/"519"',
            };
            const blacklist = ["ETAG"];

            // When
            const result = filterHeadersByBlacklist(headers, blacklist);

            // Then
            expect(result).toEqual({
                "Content-Type": "application/json",
                authorization: "Bearer token519",
            });
        });
    });

    describe("filterRequestHeaders", () => {
        it("요청 헤더 블랙리스트에 있는 항목을 제거한다", () => {
            // Given
            const headers = {
                "Content-Type": "application/json",
                Authorization: "Bearer token519",
                Cookie: "sessionid=abc123",
                Host: "example.com",
            };

            // When
            const result = filterRequestHeaders(headers);

            // Then
            expect(result).toHaveProperty("Content-Type");
            expect(result).toHaveProperty("Authorization");
            expect(result).not.toHaveProperty("Cookie");
            expect(result).not.toHaveProperty("Host");
        });
    });

    describe("filterResponseHeaders", () => {
        it("응답 헤더 블랙리스트에 있는 항목을 제거한다", () => {
            // Given
            const headers = {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
                Date: "Mon, 19 May 2000 00:00:00 GMT",
                ETag: 'W/"519"',
            };

            // When
            const result = filterResponseHeaders(headers);

            // Then
            expect(result).toHaveProperty("Content-Type");
            expect(result).toHaveProperty("Cache-Control");
            expect(result).not.toHaveProperty("Connection");
            expect(result).not.toHaveProperty("Date");
            expect(result).not.toHaveProperty("ETag");
        });
    });
});

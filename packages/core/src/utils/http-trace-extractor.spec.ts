import { describe, expect, it } from "vitest";

import { extractHttpRequest, extractHttpResponse } from "./http-trace-extractor";

import type { SupertestResponse } from "@/core";

describe("http-trace-extractor", () => {
    describe("extractHttpRequest", () => {
        it("Supertest 응답 객체에서 요청 정보를 추출한다", () => {
            // Given
            const mockResponse = {
                request: {
                    _data: { name: "lyght", id: 519 },
                    header: {
                        "Content-Type": "application/json",
                        Cookie: "session=abc",
                    },
                    method: "POST",
                    url: "http://example.com/api/users?page=1",
                    qs: { page: "1" },
                },
            } as unknown as SupertestResponse;

            // When
            const result = extractHttpRequest(mockResponse);

            // Then
            expect(result).toEqual({
                body: { name: "lyght", id: 519 },
                cookies: "session=abc",
                headers: {
                    "Content-Type": "application/json",
                    Cookie: "session=abc",
                },
                method: "POST",
                query: { page: "1" },
                url: new URL("http://example.com/api/users?page=1"),
            });
        });

        it("요청 정보가 없는 경우 기본값을 사용한다", () => {
            // Given
            const mockResponse = { request: undefined } as unknown as SupertestResponse;

            // When & Then
            expect(() => extractHttpRequest(mockResponse)).toThrow(TypeError);

            const mockResponseWithEmptyRequest = {
                request: {},
            } as unknown as SupertestResponse;

            const resultWithEmptyRequest = extractHttpRequest(mockResponseWithEmptyRequest);

            // Then
            expect(resultWithEmptyRequest).toEqual({
                body: {},
                cookies: "",
                headers: {},
                method: undefined,
                query: {},
                url: new URL("http://localhost"),
            });
        });
    });

    describe("extractHttpResponse", () => {
        it("Supertest 응답 객체에서 응답 정보를 추출한다", () => {
            // Given
            const mockResponse = {
                body: { id: 519, name: "lyght" },
                headers: { "Content-Type": "application/json" },
                status: 200,
            } as unknown as SupertestResponse;

            // When
            const result = extractHttpResponse(mockResponse);

            // Then
            expect(result).toEqual({
                body: { id: 519, name: "lyght" },
                headers: { "Content-Type": "application/json" },
                statusCode: 200,
            });
        });

        it("응답 정보가 없는 경우 기본값을 사용한다", () => {
            // Given
            const mockResponse = {} as unknown as SupertestResponse;

            // When
            const result = extractHttpResponse(mockResponse);

            // Then
            expect(result).toEqual({
                body: {},
                headers: {},
                statusCode: undefined,
            });
        });
    });
});

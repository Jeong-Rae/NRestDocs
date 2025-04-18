import { describe, expect, it } from "vitest";

import { extractHttpRequest, extractHttpResponse } from "./http-trace-extractor";

import type { SupertestResponse } from "../types";

describe("http-trace-extractor", () => {
    describe("extractHttpRequest", () => {
        it("Supertest 응답 객체에서 요청 정보를 추출한다", () => {
            // Given
            const mockResponse = {
                request: {
                    _data: { name: "John", age: 30 },
                    header: { "Content-Type": "application/json" },
                    method: "POST",
                    url: "http://example.com/api/users",
                },
            } as unknown as SupertestResponse;

            // When
            const result = extractHttpRequest(mockResponse);

            // Then
            expect(result).toEqual({
                body: { name: "John", age: 30 },
                headers: { "Content-Type": "application/json" },
                method: "POST",
                url: new URL("http://example.com/api/users"),
            });
        });

        it("요청 정보가 없는 경우 기본값을 사용한다", () => {
            // Given
            const mockResponse = {} as unknown as SupertestResponse;

            // When
            const result = extractHttpRequest(mockResponse);

            // Then
            expect(result).toEqual({
                body: {},
                headers: {},
                method: "GET",
                url: new URL("http://localhost"),
            });
        });
    });

    describe("extractHttpResponse", () => {
        it("Supertest 응답 객체에서 응답 정보를 추출한다", () => {
            // Given
            const mockResponse = {
                body: { id: 1, name: "John" },
                headers: { "Content-Type": "application/json" },
                status: 200,
            } as unknown as SupertestResponse;

            // When
            const result = extractHttpResponse(mockResponse);

            // Then
            expect(result).toEqual({
                body: { id: 1, name: "John" },
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

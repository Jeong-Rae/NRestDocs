import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";

import { extractHttpRequest, extractHttpResponse } from "./http-trace-extractor";

import type { SupertestRequest, SupertestResponse } from "@/core";

describe("extractHttpRequest", () => {
    it("should extract request information from Supertest response object", async () => {
        await given({
            request: {
                _data: { name: "lyght", id: 519 },
                header: {
                    "Content-Type": "application/json",
                    Cookie: "session=abc",
                },
                method: "POST",
                url: "http://example.com/api/users?page=1",
                qs: { page: "1" },
            } as unknown as SupertestRequest,
        })
            .when(({ request }) => extractHttpRequest(request))
            .then((result) => {
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
    });

    it("should use default values when request information is missing", async () => {
        await given({ request: {} as unknown as SupertestRequest })
            .when(({ request }) => extractHttpRequest(request))
            .then((result) => {
                expect(result).toEqual({
                    body: {},
                    cookies: "",
                    headers: {},
                    method: undefined,
                    query: {},
                    url: new URL("http://localhost"),
                });
            });
    });
});

describe("extractHttpResponse", () => {
    it("should extract response information from Supertest response object", async () => {
        await given({
            body: { id: 519, name: "lyght" },
            headers: { "Content-Type": "application/json" },
            status: 200,
        } as unknown as SupertestResponse)
            .when((mockResponse) => extractHttpResponse(mockResponse))
            .then((result) => {
                expect(result).toEqual({
                    body: { id: 519, name: "lyght" },
                    headers: { "Content-Type": "application/json" },
                    statusCode: 200,
                });
            });
    });

    it("should use default values when response information is missing", async () => {
        await given({} as unknown as SupertestResponse)
            .when((mockResponse) => extractHttpResponse(mockResponse))
            .then((result) => {
                expect(result).toEqual({
                    body: {},
                    headers: {},
                    statusCode: undefined,
                });
            });
    });
});

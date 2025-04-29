import type { DocumentSnapshot } from "@/builders";
import { describe, expect, it } from "vitest";
import { buildHttpRequestHeadersContext } from "./http-request-headers";

describe("buildHttpRequestHeadersContext", () => {
    it("should return empty headers when requestHeaders and descriptors are both empty", () => {
        const snapshot = {
            http: { requestHeaders: {} },
            headers: { request: [] },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.headers).toEqual([]);
        expect(ctx.hasFormat).toBe(false);
        expect(ctx.hasOptional).toBe(false);
    });

    it("should build headers only from requestHeaders when descriptors are empty", () => {
        const snapshot = {
            http: { requestHeaders: { "X-Request-ID": "12345" } },
            headers: { request: [] },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.headers).toEqual([
            {
                name: "X-Request-ID",
                type: "string",
                description: "",
            },
        ]);
    });

    it("should override requestHeaders with descriptor information if available", () => {
        const snapshot = {
            http: { requestHeaders: { Authorization: "Bearer token" } },
            headers: {
                request: [
                    {
                        name: "Authorization",
                        type: "string",
                        description: "Access token",
                        optional: true,
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.headers).toEqual([
            {
                name: "Authorization",
                type: "string",
                description: "Access token",
                optional: true,
            },
        ]);
    });

    it("should set description to empty string when descriptor.description is missing", () => {
        const snapshot = {
            http: { requestHeaders: { Authorization: "Bearer token" } },
            headers: {
                request: [
                    {
                        name: "Authorization",
                        type: "string",
                        // description intentionally omitted
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.headers).toEqual([
            {
                name: "Authorization",
                type: "string",
                description: "",
            },
        ]);
    });

    it("should set hasFormat true when any header has format", () => {
        const snapshot = {
            http: { requestHeaders: { "X-Custom": "value" } },
            headers: {
                request: [
                    {
                        name: "X-Custom",
                        type: "string",
                        format: "uuid",
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.hasFormat).toBe(true);
    });

    it("should set hasOptional true when any header is optional", () => {
        const snapshot = {
            http: { requestHeaders: { "X-Optional": "value" } },
            headers: {
                request: [
                    {
                        name: "X-Optional",
                        type: "string",
                        optional: true,
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestHeadersContext(snapshot);
        expect(ctx.hasOptional).toBe(true);
    });
});

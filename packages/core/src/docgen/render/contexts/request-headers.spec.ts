import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildRequestHeadersContext } from "./request-headers";

describe("buildRequestHeadersContext", () => {
    it("should return empty headers when requestHeaders and descriptors are both empty", async () => {
        const snapshot = {
            http: { requestHeaders: {} },
            headers: { request: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.headers).toEqual([]);
                expect(context.hasFormat).toBe(false);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("should build headers only from requestHeaders when descriptors are empty", async () => {
        const snapshot = {
            http: { requestHeaders: { "X-Request-ID": "12345" } },
            headers: { request: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.headers).toEqual([
                    {
                        name: "X-Request-ID",
                        type: "string",
                        description: "",
                    },
                ]);
            });
    });

    it("should override requestHeaders with descriptor information if available", async () => {
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

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.headers).toEqual([
                    {
                        name: "Authorization",
                        type: "string",
                        description: "Access token",
                        optional: true,
                    },
                ]);
            });
    });

    it("should set description to empty string when descriptor.description is missing", async () => {
        const snapshot = {
            http: { requestHeaders: { Authorization: "Bearer token" } },
            headers: {
                request: [
                    {
                        name: "Authorization",
                        type: "string",
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.headers).toEqual([
                    {
                        name: "Authorization",
                        type: "string",
                        description: "",
                    },
                ]);
            });
    });

    it("should set hasFormat true when any header has format", async () => {
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

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasFormat).toBe(true);
            });
    });

    it("should set hasOptional true when any header is optional", async () => {
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

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasOptional).toBe(true);
            });
    });
});

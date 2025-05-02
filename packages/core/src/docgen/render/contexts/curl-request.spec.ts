import type { DocumentSnapshot } from "@/docgen/builders";
import { MissingFieldError } from "@/errors";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildCurlContext } from "./curl-request";

describe("buildCurlContext", () => {
    it("should throw MissingFieldError when method is missing", async () => {
        const snapshot = {
            http: {
                method: undefined,
                url: new URL("https://api.example.com/users"),
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .catch((err) => expect(err).toBeInstanceOf(MissingFieldError));
    });

    it("should throw MissingFieldError when url is missing", async () => {
        const snapshot = {
            http: {
                method: "GET",
                url: undefined,
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .catch((err) => expect(err).toBeInstanceOf(MissingFieldError));
    });

    it("should build context with only method and url", async () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/products"),
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .then(({ context }) => {
                expect(context.method).toBe("GET");
                expect(context.url).toBe("https://api.example.com/products");
                expect(context.options.trim()).toBe("-X GET");
            });
    });

    it("should build context with only headers", async () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/products/519"),
                requestHeaders: {
                    Accept: "application/json",
                    Authorization: "Bearer token-519",
                },
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .then(({ context }) => {
                expect(context.options).toContain('-H "Accept: application/json"');
                expect(context.options).toContain('-H "Authorization: Bearer token-519"');
            });
    });

    it("should build context with only cookies", async () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/cart"),
                requestCookies: "SESSIONID=abc519; secure=true",
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .then(({ context }) => {
                expect(context.options).toContain('--cookie "SESSIONID=abc519; secure=true"');
            });
    });

    it("should build context with only body", async () => {
        const snapshot = {
            http: {
                method: "POST",
                url: new URL("https://api.example.com/orders"),
                requestBody: {
                    productId: 519,
                    quantity: 3,
                },
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .then(({ context }) => {
                expect(context.options).toContain("-X POST");
                expect(context.options).toContain('-d "{\\"productId\\":519,\\"quantity\\":3}"');
            });
    });

    it("should build context with method, url, headers, cookies, query, and body", async () => {
        const snapshot = {
            http: {
                method: "PATCH",
                url: new URL("https://api.example.com/orders/519"),
                requestHeaders: {
                    "Content-Type": "application/json",
                },
                requestCookies: "auth_token=secure519",
                requestQuery: {
                    update: "true",
                },
                requestBody: {
                    status: "shipped",
                },
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildCurlContext(snapshot))
            .then(({ context }) => {
                expect(context.method).toBe("PATCH");
                expect(context.url).toBe("https://api.example.com/orders/519?update=true");
                expect(context.options).toContain("-X PATCH");
                expect(context.options).toContain('-H "Content-Type: application/json"');
                expect(context.options).toContain('--cookie "auth_token=secure519"');
                expect(context.options).toContain('-d "{\\"status\\":\\"shipped\\"}"');
            });
    });
});

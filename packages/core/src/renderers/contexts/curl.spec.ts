import type { DocumentSnapshot } from "@/builders";
import { MissingFieldError } from "@/errors";
import { describe, expect, it } from "vitest";
import { buildCurlContext } from "./curl";

describe("buildCurlContext", () => {
    it("should throw MissingFieldError when method is missing", () => {
        const snapshot = {
            http: {
                method: undefined,
                url: new URL("https://api.example.com/users"),
            },
        } as unknown as DocumentSnapshot;

        expect(() => buildCurlContext(snapshot)).toThrow(MissingFieldError);
    });

    it("should throw MissingFieldError when url is missing", () => {
        const snapshot = {
            http: {
                method: "GET",
                url: undefined,
            },
        } as unknown as DocumentSnapshot;

        expect(() => buildCurlContext(snapshot)).toThrow(MissingFieldError);
    });

    it("should build context with only method and url", () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/products"),
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildCurlContext(snapshot);
        expect(ctx.method).toBe("GET");
        expect(ctx.url).toBe("https://api.example.com/products");
        expect(ctx.options.trim()).toBe("-X GET");
    });

    it("should build context with only headers", () => {
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

        const ctx = buildCurlContext(snapshot);

        expect(ctx.options).toContain('-H "Accept: application/json"');
        expect(ctx.options).toContain('-H "Authorization: Bearer token-519"');
    });

    it("should build context with only cookies", () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/cart"),
                requestCookies: "SESSIONID=abc519; secure=true",
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildCurlContext(snapshot);

        expect(ctx.options).toContain('--cookie "SESSIONID=abc519; secure=true"');
    });

    it("should build context with only body", () => {
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

        const ctx = buildCurlContext(snapshot);

        expect(ctx.options).toContain("-X POST");
        expect(ctx.options).toContain('-d "{\\"productId\\":519,\\"quantity\\":3}"');
    });

    it("should build context with method, url, headers, cookies, query, and body", () => {
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

        const ctx = buildCurlContext(snapshot);

        expect(ctx.method).toBe("PATCH");
        expect(ctx.url).toBe("https://api.example.com/orders/519?update=true");
        expect(ctx.options).toContain("-X PATCH");
        expect(ctx.options).toContain('-H "Content-Type: application/json"');
        expect(ctx.options).toContain('--cookie "auth_token=secure519"');
        expect(ctx.options).toContain('-d "{\\"status\\":\\"shipped\\"}"');
    });
});

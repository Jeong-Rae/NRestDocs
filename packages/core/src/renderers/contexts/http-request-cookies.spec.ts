import type { DocumentSnapshot } from "@/builders";
import { describe, expect, it } from "vitest";
import { buildHttpRequestCookiesContext } from "./http-request-cookies";

describe("buildHttpRequestCookiesContext", () => {
    it("should return empty when no cookies in snapshot", () => {
        const snapshot = {
            http: { requestCookies: "" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestCookiesContext(snapshot);
        expect(ctx.cookies).toHaveLength(0);
        expect(ctx.hasOptional).toBe(false);
    });

    it("should parse simple cookies and merge descriptors", () => {
        const snapshot = {
            http: { requestCookies: "a=1; b=2" },
            cookies: { request: [{ name: "b", description: "b is 2", optional: true }] },
        } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestCookiesContext(snapshot);
        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "a", description: "" }),
                expect.objectContaining({ name: "b", description: "b is 2", optional: true }),
            ])
        );
        expect(ctx.hasOptional).toBe(true);
    });

    it("should correctly process cookie descriptors from snapshot.cookies.request", () => {
        const snapshot = {
            http: { requestCookies: "session=abc; theme=dark" },
            cookies: {
                request: [
                    { name: "session", type: "string", description: "Session ID" },
                    { name: "theme", type: "string" },
                ],
            },
        } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestCookiesContext(snapshot);

        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "session" }),
                expect.objectContaining({ name: "theme" }),
            ])
        );
    });

    it("should handle invalid URI components gracefully", () => {
        const snapshot = {
            http: { requestCookies: "valid=1; invalid%=invalid%; another=2" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestCookiesContext(snapshot);
        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "valid", type: "string", description: "" }),
                expect.objectContaining({ name: "another", type: "string", description: "" }),
            ])
        );
        expect(ctx.cookies).toHaveLength(2);
        expect(ctx.hasOptional).toBe(false);
    });

    it("should handle duplicate cookie names gracefully", () => {
        const snapshot = {
            http: { requestCookies: "name=lyght;" },
            cookies: {},
        } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestCookiesContext(snapshot);
        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "name", type: "string", description: "" }),
            ])
        );
        expect(ctx.cookies).toHaveLength(1);
        expect(ctx.hasOptional).toBe(false);
    });
});

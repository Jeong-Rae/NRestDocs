import type { DocumentSnapshot } from "@/builders";
import { describe, expect, it } from "vitest";
import { buildRequestCookiesContext } from "./request-cookies";

describe("buildRequestCookiesContext", () => {
    it("should return no cookies when none present", () => {
        const snapshot = {
            http: { requestCookies: "" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestCookiesContext(snapshot);
        expect(ctx.cookies).toHaveLength(0);
        expect(ctx.hasOptional).toBe(false);
    });

    it("should parse simple cookies and merge descriptors", () => {
        const snapshot = {
            http: { requestCookies: "a=1; b=2" },
            cookies: { request: [{ name: "b", description: "b is 2", optional: true }] },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestCookiesContext(snapshot);
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
        const ctx = buildRequestCookiesContext(snapshot);

        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "session" }),
                expect.objectContaining({ name: "theme" }),
            ])
        );
    });

    it("should skip invalid cookies gracefully", () => {
        const snapshot = {
            http: { requestCookies: "good=1; bad%=%; ok=2" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;

        const { cookies } = buildRequestCookiesContext(snapshot);
        expect(cookies.map((c) => c.name)).toEqual(expect.arrayContaining(["good", "ok"]));
    });

    it("should snapshot.cookies.request is empty", () => {
        const snapshot = {
            http: { requestCookies: "name=lyght;" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestCookiesContext(snapshot);
        expect(ctx.cookies).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ name: "name", type: "string", description: "" }),
            ])
        );
        expect(ctx.cookies).toHaveLength(1);
        expect(ctx.hasOptional).toBe(false);
    });
});

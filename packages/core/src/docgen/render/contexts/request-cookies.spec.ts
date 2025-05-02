import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildRequestCookiesContext } from "./request-cookies";

describe("buildRequestCookiesContext", () => {
    it("should return no cookies when none present", async () => {
        const snapshot = {
            http: { requestCookies: "" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestCookiesContext(snapshot))
            .then(({ context }) => {
                expect(context.cookies).toHaveLength(0);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("should parse simple cookies and merge descriptors", async () => {
        const snapshot = {
            http: { requestCookies: "a=1; b=2" },
            cookies: { request: [{ name: "b", description: "b is 2", optional: true }] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestCookiesContext(snapshot))
            .then(({ context }) => {
                expect(context.cookies).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "a", description: "" }),
                        expect.objectContaining({
                            name: "b",
                            description: "b is 2",
                            optional: true,
                        }),
                    ])
                );
                expect(context.hasOptional).toBe(true);
            });
    });

    it("should correctly process cookie descriptors from snapshot.cookies.request", async () => {
        const snapshot = {
            http: { requestCookies: "session=abc; theme=dark" },
            cookies: {
                request: [
                    { name: "session", type: "string", description: "Session ID" },
                    { name: "theme", type: "string" },
                ],
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestCookiesContext(snapshot))
            .then(({ context }) => {
                expect(context.cookies).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "session" }),
                        expect.objectContaining({ name: "theme" }),
                    ])
                );
            });
    });

    it("should skip invalid cookies gracefully", async () => {
        const snapshot = {
            http: { requestCookies: "good=1; bad%=%; ok=2" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestCookiesContext(snapshot))
            .then(({ context }) => {
                expect(context.cookies.map((c) => c.name)).toEqual(
                    expect.arrayContaining(["good", "ok"])
                );
            });
    });

    it("should return empty cookies when snapshot.cookies.request is empty", async () => {
        const snapshot = {
            http: { requestCookies: "name=lyght;" },
            cookies: { request: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestCookiesContext(snapshot))
            .then(({ context }) => {
                expect(context.cookies).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ name: "name", type: "string", description: "" }),
                    ])
                );
                expect(context.cookies).toHaveLength(1);
                expect(context.hasOptional).toBe(false);
            });
    });
});

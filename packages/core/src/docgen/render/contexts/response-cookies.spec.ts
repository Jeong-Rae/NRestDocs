import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildResponseCookiesContext } from "./response-cookies";

describe("buildResponseCookiesContext", () => {
    it("returns empty context when no response cookies", async () => {
        const snapshot = {
            cookies: {
                response: [],
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseCookiesContext(snapshot))
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(true);
                expect(context.cookies).toEqual([]);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("sets hasOptional to false when all cookies are required", async () => {
        const cookies = [
            { name: "auth_token", type: "string" },
            { name: "session", type: "string" },
        ];

        const snapshot = {
            cookies: {
                response: cookies,
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseCookiesContext(snapshot))
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(false);
                expect(context.cookies).toEqual(cookies);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("sets hasOptional to true if any cookie is optional", async () => {
        const cookies = [
            { name: "auth_token", type: "string", optional: true },
            { name: "refresh_token", type: "string" },
        ];

        const snapshot = {
            cookies: {
                response: cookies,
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseCookiesContext(snapshot))
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(false);
                expect(context.cookies).toEqual(cookies);
                expect(context.hasOptional).toBe(true);
            });
    });
});

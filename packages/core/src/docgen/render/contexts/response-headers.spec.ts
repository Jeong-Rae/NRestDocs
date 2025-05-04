import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { buildResponseHeadersContext } from "./response-headers";

describe("buildResponseHeaderContext", () => {
    it("should return empty headers when descriptors are empty", async () => {
        const snapshot = {
            headers: { response: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.headers).toEqual([]);
                expect(context.hasFormat).toBe(false);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("should return headers as is from descriptors", async () => {
        const snapshot = {
            headers: {
                response: [
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
            .when(({ snapshot }) => buildResponseHeadersContext(snapshot))
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

    it("should set hasFormat true when any header has format", async () => {
        const snapshot = {
            headers: {
                response: [
                    {
                        name: "X-Custom",
                        type: "string",
                        format: "uuid",
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasFormat).toBe(true);
            });
    });

    it("should set hasOptional true when any header is optional", async () => {
        const snapshot = {
            headers: {
                response: [
                    {
                        name: "X-Optional",
                        type: "string",
                        optional: true,
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseHeadersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasOptional).toBe(true);
            });
    });
});

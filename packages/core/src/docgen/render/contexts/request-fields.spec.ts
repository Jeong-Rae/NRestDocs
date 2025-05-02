import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildRequestFieldsContext } from "./request-fields";

describe("buildRequestFieldsContext", () => {
    it("should return empty lists when no body and no descriptors", async () => {
        const snapshot = {
            http: { requestBody: {} },
            fields: { request: [] },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.fields).toEqual([]);
            });
    });

    it("should infer field types from body", async () => {
        const snapshot = {
            http: { requestBody: { x: 1 } },
            fields: {
                request: [{ name: "x", type: "string" }],
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.fields).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ path: "x", type: "string" }),
                        expect.not.objectContaining({ path: "x", type: "number" }),
                    ])
                );
            });
    });

    it("should correctly process field descriptors from snapshot.fields.request", async () => {
        const snapshot = {
            http: { requestBody: { x: 1 } },
            fields: {
                request: [{ name: "x", type: "string", optional: true, format: "uuid" }],
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.hasOptional).toBe(true);
                expect(context.hasFormat).toBe(true);
            });
    });

    it("should assign default description when none present", async () => {
        const snapshot = {
            http: { requestBody: { x: 1, y: "str" } },
            fields: {
                request: [{ name: "y", type: "string" }],
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.fields).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ path: "x", type: "number", description: "" }),
                        expect.objectContaining({ path: "y", type: "string", description: "" }),
                    ])
                );
            });
    });
});

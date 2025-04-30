import type { DocumentSnapshot } from "@/docgen/builders";
import { describe, expect, it } from "vitest";
import { buildRequestFieldsContext } from "./request-fields";

describe("buildRequestFieldsContext", () => {
    it("should return empty lists when no body and no descriptors", () => {
        const snapshot = {
            http: { requestBody: {} },
            fields: { request: [] },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestFieldsContext(snapshot);
        expect(ctx.fields).toEqual([]);
    });

    it("should infer field types from body", () => {
        const snapshot = {
            http: { requestBody: { x: 1 } },
            fields: {
                request: [{ name: "x", type: "string" }],
            },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestFieldsContext(snapshot);
        expect(ctx.fields).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: "x", type: "string" }),
                expect.not.objectContaining({ path: "x", type: "number" }),
            ])
        );
    });

    it("should correctly process field descriptors from snapshot.fields.request", () => {
        const snapshot = {
            http: { requestBody: { x: 1 } },
            fields: {
                request: [{ name: "x", type: "string", optional: true, format: "uuid" }],
            },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestFieldsContext(snapshot);
        expect(ctx.hasOptional).toBe(true);
        expect(ctx.hasFormat).toBe(true);
    });

    it("should assign default description when none present", () => {
        const snapshot = {
            http: { requestBody: { x: 1, y: "str" } },
            fields: {
                request: [{ name: "y", type: "string" }],
            },
        } as unknown as DocumentSnapshot;
        const ctx = buildRequestFieldsContext(snapshot);

        expect(ctx.fields).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ path: "x", type: "number", description: "" }),
                expect.objectContaining({ path: "y", type: "string", description: "" }),
            ])
        );
    });
});

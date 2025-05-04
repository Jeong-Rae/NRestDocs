import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { buildRequestFieldsContext } from "./request-fields";

describe("buildRequestFieldsContext", () => {
    it("should return empty lists when no descriptors", async () => {
        const snapshot = {
            fields: { request: [] },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(true);
                expect(context.fields).toEqual([]);
                expect(context.hasOptional).toBe(false);
                expect(context.hasFormat).toBe(false);
            });
    });

    it("should correctly process field descriptors from snapshot.fields.request", async () => {
        const snapshot = {
            fields: {
                request: [
                    {
                        name: "x",
                        type: "string",
                        optional: true,
                        format: "uuid",
                        description: "Test UUID",
                    },
                ],
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestFieldsContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(false);
                expect(context.fields).toEqual([
                    {
                        path: "x",
                        type: "string",
                        optional: true,
                        format: "uuid",
                        description: "Test UUID",
                    },
                ]);
                expect(context.hasOptional).toBe(true);
                expect(context.hasFormat).toBe(true);
            });
    });
});

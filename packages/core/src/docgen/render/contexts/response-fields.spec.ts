import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildResponseFieldsContext } from "./response-fields";

describe("buildResponseFieldsContext", () => {
    it("should return empty fields when no descriptors", async () => {
        const snapshot = {
            fields: { response: [] },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseFieldsContext(snapshot))
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(true);
                expect(context.fields).toEqual([]);
                expect(context.hasOptional).toBe(false);
                expect(context.hasFormat).toBe(false);
            });
    });

    it("should correctly process field descriptors including optional and format", async () => {
        const snapshot = {
            fields: {
                response: [
                    {
                        name: "x",
                        type: "string",
                        optional: true,
                        format: "uuid",
                        description: "Identifier",
                    },
                ],
            },
        } as unknown as DocumentSnapshot;

        const expectedFields = [
            {
                path: "x",
                type: "string",
                optional: true,
                format: "uuid",
                description: "Identifier",
            },
        ];

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseFieldsContext(snapshot))
            .then(({ context, isEmpty }) => {
                expect(isEmpty).toBe(false);
                expect(context.fields).toEqual(expectedFields);
                expect(context.hasOptional).toBe(true);
                expect(context.hasFormat).toBe(true);
            });
    });
});

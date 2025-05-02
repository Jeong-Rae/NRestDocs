import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildQueryParametersContext } from "./query-parameters";

describe("buildQueryParametersContext", () => {
    it("returns empty context and flags when no query parameters exist", async () => {
        const snapshot = {
            parameters: { query: [] },
        } as unknown as DocumentSnapshot;

        const expectedContext = {
            parameters: [],
            hasType: false,
            hasFormat: false,
            hasOptional: false,
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildQueryParametersContext(snapshot))
            .then(({ context }) => {
                expect(context).toEqual(expectedContext);
            });
    });

    it("sets hasType=true when at least one parameter has type", async () => {
        const parameters = [{ name: "page", type: "integer" }, { name: "keyword" }];
        const snapshot = {
            parameters: { query: parameters },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildQueryParametersContext(snapshot))
            .then(({ context }) => {
                expect(context.parameters).toEqual(parameters);
                expect(context.hasType).toBe(true);
                expect(context.hasFormat).toBe(false);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("sets hasFormat=true when any parameter has format", async () => {
        const parameters = [
            { name: "sort", type: "string", format: "enum" },
            { name: "page", type: "integer" },
        ];
        const snapshot = {
            parameters: { query: parameters },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildQueryParametersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasFormat).toBe(true);
                expect(context.hasType).toBe(true);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("sets hasOptional=true when any parameter is optional", async () => {
        const parameters = [
            { name: "page", type: "integer", optional: true },
            { name: "limit", type: "integer" },
        ];
        const snapshot = {
            parameters: { query: parameters },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildQueryParametersContext(snapshot))
            .then(({ context }) => {
                expect(context.hasOptional).toBe(true);
                expect(context.hasType).toBe(true);
                expect(context.hasFormat).toBe(false);
            });
    });

    it("sets all flags true when mixed properties exist", async () => {
        const parameters = [
            { name: "page", type: "integer", optional: true },
            { name: "version", type: "string", format: "semver" },
        ];
        const snapshot = {
            parameters: { query: parameters },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildQueryParametersContext(snapshot))
            .then(({ context }) => {
                expect(context.parameters).toEqual(parameters);
                expect(context.hasType).toBe(true);
                expect(context.hasFormat).toBe(true);
                expect(context.hasOptional).toBe(true);
            });
    });
});

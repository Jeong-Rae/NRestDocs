import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildPathParametersContext } from "./path-parameters";

describe("buildPathParametersContext", () => {
    it("should return context with empty parameters and false flags when no path parameters exist.", async () => {
        const snapshot = {
            http: { path: "/users/:userId" },
            parameters: { path: [] },
        };
        const expectedContext = {
            path: "/users/:userId",
            parameters: [],
            hasFormat: false,
            hasOptional: false,
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildPathParametersContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => expect(context).toEqual(expectedContext));
    });

    it("should return context with parameters but false flags when parameters lack format and optional.", async () => {
        const parameters = [{ name: "userId", type: "string" }];
        const snapshot = {
            http: { path: "/users/:userId" },
            parameters: { path: parameters },
        };
        const expectedContext = {
            path: "/users/:userId",
            parameters,
            hasFormat: false,
            hasOptional: false,
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildPathParametersContext(snapshot as DocumentSnapshot))
            .then(({ context }) => expect(context).toEqual(expectedContext));
    });

    it("should set hasFormat to true if any parameter has a format.", async () => {
        const parameters = [
            { name: "userId", type: "string" },
            { name: "postId", type: "integer", format: "int32" },
        ];
        const snapshot = {
            http: { path: "/users/:userId/posts/:postId" },
            parameters: { path: parameters },
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildPathParametersContext(snapshot as DocumentSnapshot))
            .then(({ context }) => {
                expect(context.path).toBe("/users/:userId/posts/:postId");
                expect(context.parameters).toEqual(parameters);
                expect(context.hasFormat).toBe(true);
                expect(context.hasOptional).toBe(false);
            });
    });

    it("should set hasOptional to true if any parameter is optional.", async () => {
        const parameters = [
            { name: "userId", type: "string", optional: true },
            { name: "filter", type: "string" },
        ];
        const snapshot = {
            http: { path: "/users/:userId" },
            parameters: { path: parameters },
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildPathParametersContext(snapshot as DocumentSnapshot))
            .then(({ context }) => {
                expect(context.path).toBe("/users/:userId");
                expect(context.parameters).toEqual(parameters);
                expect(context.hasFormat).toBe(false);
                expect(context.hasOptional).toBe(true);
            });
    });

    it("should set both hasFormat and hasOptional to true if applicable parameters exist.", async () => {
        const parameters = [
            { name: "userId", type: "string", optional: true },
            { name: "version", type: "string", format: "semver" },
        ];
        const snapshot = {
            http: { path: "/api/:version/users/:userId" },
            parameters: { path: parameters },
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildPathParametersContext(snapshot as DocumentSnapshot))
            .then(({ context }) => {
                expect(context.path).toBe("/api/:version/users/:userId");
                expect(context.parameters).toEqual(parameters);
                expect(context.hasFormat).toBe(true);
                expect(context.hasOptional).toBe(true);
            });
    });

    it("should correctly set the path from the snapshot.", async () => {
        const specificPath = "/items/:itemId/details";
        const parameters = [{ name: "itemId", type: "integer" }];
        const snapshot = {
            http: { path: specificPath },
            parameters: { path: parameters },
        };

        await given({ snapshot })
            .when(({ snapshot }) => buildPathParametersContext(snapshot as DocumentSnapshot))
            .then(({ context }) => {
                expect(context.path).toBe(specificPath);
                expect(context.parameters).toEqual(parameters);
                expect(context.hasFormat).toBe(false);
                expect(context.hasOptional).toBe(false);
            });
    });
});

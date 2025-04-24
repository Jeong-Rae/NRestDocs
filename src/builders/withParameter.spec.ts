import { describe, expect, it } from "vitest";
import type { ParameterDescriptor } from "../types";
import type { OpenAPI_V3_1 } from "../types/open-api-spec";
import { applyPathParameters, applyQueryParameters, renderParameters } from "./withParameters";

const baseDescriptor: ParameterDescriptor = {
    name: "id",
    type: "string",
    description: "an identifier",
    optional: false,
};

describe("withParameters", () => {
    describe("applyPathParameters", () => {
        it("should normalize and return the same descriptors array", () => {
            const input: ParameterDescriptor[] = [
                { ...baseDescriptor, name: "userId" },
                { ...baseDescriptor, name: "postId" },
            ];
            const output = applyPathParameters(input);

            expect(output).toEqual(input);
        });
    });

    describe("applyQueryParameters", () => {
        it("should normalize and return the same descriptors array", () => {
            const input: ParameterDescriptor[] = [
                { ...baseDescriptor, name: "search" },
                { ...baseDescriptor, name: "limit", optional: true },
            ];
            const output = applyQueryParameters(input);

            expect(output).toEqual(input);
        });
    });

    describe("renderParameters", () => {
        it("should return undefined for undefined or empty descriptors", () => {
            expect(renderParameters(undefined, "query")).toBeUndefined();
            expect(renderParameters([], "path")).toBeUndefined();
        });

        it("should render path parameters as required always", () => {
            const descriptors: ParameterDescriptor[] = [
                { ...baseDescriptor, name: "userId", optional: true },
            ];
            const result = renderParameters(descriptors, "path");
            expect(result).toHaveLength(1);
            expect(result![0]).toEqual({
                name: "userId",
                in: "path",
                required: true,
                style: "simple",
                explode: false,
                allowEmptyValue: false,
                description: baseDescriptor.description,
                schema: {},
                deprecated: false,
                allowReserved: false,
            });
        });

        it("should render query parameters respecting optional flag", () => {
            const descriptors: ParameterDescriptor[] = [
                { ...baseDescriptor, name: "q", optional: false },
                { ...baseDescriptor, name: "page", optional: true },
            ];
            const result = renderParameters(descriptors, "query")!;
            expect(result).toHaveLength(2);

            expect(result[0]).toEqual({
                name: "q",
                in: "query",
                required: true,
                description: baseDescriptor.description,
                schema: {},
                deprecated: false,
                style: "simple",
                explode: false,
                allowReserved: false,
                allowEmptyValue: false,
            });

            expect(result[1]).toEqual({
                name: "page",
                in: "query",
                required: false,
                description: baseDescriptor.description,
                schema: {},
                deprecated: false,
                style: "simple",
                explode: false,
                allowReserved: false,
                allowEmptyValue: false,
            });
        });

        it("should set common fields correctly", () => {
            const descriptors: ParameterDescriptor[] = [
                { ...baseDescriptor, name: "filter", description: "filter term", optional: true },
            ];
            const result = renderParameters(descriptors, "header")!;
            expect(result[0]).toEqual({
                name: "filter",
                in: "header",
                description: "filter term",
                required: false,
                schema: {},
                deprecated: false,
                style: "simple",
                explode: false,
                allowReserved: false,
                allowEmptyValue: false,
            });
        });
    });
});

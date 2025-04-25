import { describe, expect, it } from "vitest";
import type { FieldDescriptor, HeaderDescriptor, PartDescriptor } from "../types";
import {
    applyRequestFields,
    applyRequestHeaders,
    applyRequestParts,
    renderRequestBody,
    renderRequestFieldSchema,
    renderRequestPartSchema,
} from "./withRequest";

const baseHeader: HeaderDescriptor = {
    name: "X-Test",
    type: "string",
    description: "test header",
    optional: false,
};
const basePart: PartDescriptor = {
    name: "file",
    type: "application/octet-stream",
    description: "upload",
    optional: false,
};
const baseField: FieldDescriptor = {
    name: "foo",
    type: "string",
    description: "a foo",
    optional: false,
};

describe("withRequest", () => {
    describe("applyRequestHeaders", () => {
        it("should pass through header descriptors array", () => {
            const input = [baseHeader];
            const output = applyRequestHeaders(input);
            expect(output).toEqual(input);
        });
    });

    describe("applyRequestParts", () => {
        it("should pass through part descriptors array", () => {
            const input: PartDescriptor[] = [basePart];
            const output = applyRequestParts(input);
            expect(output).toEqual(input);
        });
    });

    describe("applyRequestFields", () => {
        it("should pass through field descriptors array", () => {
            const input: FieldDescriptor[] = [baseField];
            const output = applyRequestFields(input);
            expect(output).toEqual(input);
        });
    });

    describe("renderRequestFieldSchema", () => {
        it("should return empty object schema when no fields", () => {
            const schema = renderRequestFieldSchema([]);
            expect(schema).toEqual({
                type: "object",
                properties: {},
            });
        });

        it("should include required only for non-optional fields", () => {
            const fields: FieldDescriptor[] = [
                { ...baseField, name: "a", optional: false },
                { ...baseField, name: "b", optional: true },
            ];
            const schema = renderRequestFieldSchema(fields);
            expect(schema).toEqual({
                type: "object",
                properties: {
                    a: { type: "string" },
                    b: { type: "string" },
                },
                required: ["a"],
            });
        });
    });

    describe("renderRequestPartSchema", () => {
        it("should build schema and encoding for parts", () => {
            const parts: PartDescriptor[] = [
                { ...basePart, name: "f1", optional: false },
                { ...basePart, name: "f2", optional: true },
            ];
            const { schema, encoding } = renderRequestPartSchema(parts);
            expect(schema).toEqual({
                type: "object",
                properties: {
                    f1: { type: "string" },
                    f2: { type: "string" },
                },
                required: ["f1"],
            });
            expect(Object.keys(encoding)).toEqual(expect.arrayContaining(["f1", "f2"]));
            expect(encoding.f1).toMatchObject({
                contentType: basePart.type,
                style: "form",
                explode: false,
                allowReserved: false,
            });
        });
    });

    describe("renderRequestBody", () => {
        const fields: FieldDescriptor[] = [{ ...baseField, name: "a", optional: false }];
        const parts: PartDescriptor[] = [{ ...basePart, name: "p", optional: false }];

        it("returns undefined when both fields and parts empty", () => {
            expect(renderRequestBody("application/json", [], [])).toBeUndefined();
        });

        it("builds json body for fields", () => {
            const body = renderRequestBody("application/json", fields, []);
            expect(body).toEqual({
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: { a: { type: "string" } },
                            required: ["a"],
                        },
                    },
                },
                required: true,
            });
        });

        it("builds urlencoded body", () => {
            const body = renderRequestBody("application/x-www-form-urlencoded", fields, []);
            expect(body).toEqual({
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: {
                            type: "object",
                            properties: { a: { type: "string" } },
                            required: ["a"],
                        },
                    },
                },
                required: true,
            });
        });

        it("builds multipart body for parts", () => {
            const body = renderRequestBody("multipart/form-data", [], parts)!;
            expect(body).toHaveProperty("content");
            const mt = body.content["multipart/form-data"];
            expect(mt).toHaveProperty("schema");
            expect(mt).toHaveProperty("encoding");
        });
    });
});

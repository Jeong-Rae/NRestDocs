import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { E_INVALID_TYPE, InvalidTypeError } from "./invalid-type-error";

describe("InvalidTypeError()", () => {
    it("should generate correct reason and suggestion when fieldName is present", async () => {
        await given({
            options: {
                context: "ConfigLoader.load",
                fieldName: "port",
                expected: "number",
                actual: "abc",
            },
        })
            .when(({ options }) => new InvalidTypeError(options))
            .then((error) => {
                expect(error).toBeInstanceOf(InvalidTypeError);
                expect(error.code).toBe(E_INVALID_TYPE);
                expect(error.context).toBe("ConfigLoader.load");
                expect(error.reason).toContain("port");
                expect(error.suggestion).toContain("port");
                expect(error.data).toEqual({
                    expected: "number",
                    actual: "abc",
                    fieldName: "port",
                });
            });
    });

    it("should generate correct reason and suggestion when fieldName is absent", async () => {
        await given({
            options: {
                context: "ConfigLoader.load",
                expected: "number",
                actual: "abc",
            },
        })
            .when(({ options }) => new InvalidTypeError(options))
            .then((error) => {
                expect(error).toBeInstanceOf(InvalidTypeError);
                expect(error.code).toBe(E_INVALID_TYPE);
                expect(error.context).toBe("ConfigLoader.load");
                expect(error.reason).toContain("expected 'number', got 'abc'");
                expect(error.reason).not.toContain("field");
                expect(error.suggestion).toContain("Pass a value compatible with 'number'");
                expect(error.suggestion).not.toContain("Ensure");
                expect(error.data).toEqual({
                    expected: "number",
                    actual: "abc",
                    fieldName: undefined,
                });
            });
    });
});

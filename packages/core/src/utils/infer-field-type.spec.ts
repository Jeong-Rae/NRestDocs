import { describe, expect, it } from "vitest";
import { inferFieldType } from "./infer-field-type";

describe("inferFieldType", () => {
    it("should return 'null' for null value", () => {
        expect(inferFieldType(null)).toBe("null");
    });

    it("should return 'array' for array value", () => {
        expect(inferFieldType([1, 2, 3])).toBe("array");
    });

    it("should return 'boolean' for boolean value", () => {
        expect(inferFieldType(true)).toBe("boolean");
        expect(inferFieldType(false)).toBe("boolean");
    });

    it("should return 'string' for string value", () => {
        expect(inferFieldType("lyght")).toBe("string");
    });

    it("should return 'number' for number and bigint values", () => {
        expect(inferFieldType(519)).toBe("number");
        expect(inferFieldType(BigInt(519))).toBe("number");
    });

    it("should return 'object' for object value", () => {
        expect(inferFieldType({ key: "value" })).toBe("object");
    });

    it("should throw error for unsupported types", () => {
        expect(() =>
            inferFieldType(() => {
                /** empty block */
            })
        ).toThrow("Unsupported type: function");
        expect(() => inferFieldType(Symbol("lyght"))).toThrow("Unsupported type: symbol");
        expect(() => inferFieldType(undefined)).toThrow("Unsupported type: undefined");
    });
});

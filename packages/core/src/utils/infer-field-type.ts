import type { FieldType } from "@/core";

export function inferFieldType(value: unknown): FieldType {
    if (value === null) {
        return "null";
    }
    if (Array.isArray(value)) {
        return "array";
    }

    switch (typeof value) {
        case "boolean":
            return "boolean";
        case "string":
            return "string";
        case "number":
        case "bigint":
            return "number";
        case "object":
            return "object";
        default:
            throw new Error(`Unsupported type: ${typeof value}`);
    }
}

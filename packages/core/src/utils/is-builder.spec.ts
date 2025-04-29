import { describe, expect, it } from "vitest";
import { isBuilder } from "./is-builder";

describe("isBuilder", () => {
    it("should return true when object has build function", () => {
        const builder = {
            build: () => "result",
        };
        expect(isBuilder(builder)).toBe(true);
    });

    it("should return false when build property is missing", () => {
        const obj = {
            notBuild: () => "nope",
        };
        expect(isBuilder(obj)).toBe(false);
    });

    it("should return false when build property is not a function", () => {
        const obj = {
            build: "not a function",
        };
        expect(isBuilder(obj)).toBe(false);
    });

    it("should return false for non-object values", () => {
        expect(isBuilder(null)).toBe(false);
        expect(isBuilder(undefined)).toBe(false);
        expect(isBuilder(519)).toBe(false);
        expect(isBuilder("lyght")).toBe(false);
        expect(isBuilder(true)).toBe(false);
        expect(isBuilder(Symbol("builder"))).toBe(false);
    });

    it("should return true for array even if it has build property", () => {
        // biome-ignore lint/suspicious/noExplicitAny: testcase ignore
        const arr = [] as any;
        arr.build = () => "something";
        expect(isBuilder(arr)).toBe(true);
    });
});

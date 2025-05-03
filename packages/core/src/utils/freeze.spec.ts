import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { deepFreeze, freeze } from "./freeze";

describe("freeze", () => {
    it("should freeze an object", async () => {
        await given({
            obj: { a: 1, b: 2 },
        })
            .when(({ obj }) => freeze(obj))
            .then((obj) => {
                expect(obj).toEqual({ a: 1, b: 2 });
                expect(Object.isFrozen(obj)).toBe(true);
            });
    });

    it("should freeze an top level value", async () => {
        await given({ obj: { a: 1, b: { c: 2, d: 3 } } })
            .when(({ obj }) => freeze(obj))
            .then((frozen) => {
                expect(frozen).toEqual({ a: 1, b: { c: 2, d: 3 } });
                expect(Object.isFrozen(frozen)).toBe(true);
                expect(Object.isFrozen(frozen.b)).toBe(false);
            });
    });
});

describe("deepFreeze", () => {
    it("should freeze an object recursively", async () => {
        await given({ obj: { a: 1, b: { c: 2, d: 3 } } })
            .when(({ obj }) => deepFreeze(obj))
            .then((frozen) => {
                expect(frozen).toEqual({ a: 1, b: { c: 2, d: 3 } });
                expect(Object.isFrozen(frozen)).toBe(true);
            });
    });

    it("should not freeze non-object values", async () => {
        await given({ obj: { a: 1, b: "string", c: true } })
            .when(({ obj }) => deepFreeze(obj))
            .then((frozen) => {
                expect(frozen).toEqual({ a: 1, b: "string", c: true });
                expect(Object.isFrozen(frozen)).toBe(true);
            });
    });
});

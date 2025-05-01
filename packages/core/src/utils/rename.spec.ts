import { describe, expect, it } from "vitest";
import { deepRenameKey, renameKey } from "./rename";
import { given } from "./test";

describe("renameKey", () => {
    it("should rename keys of a single object.", async () => {
        await given({ source: { a: 1, b: 2, c: 3 }, keyMap: { a: "A", b: "B" } })
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toEqual({ A: 1, B: 2, c: 3 }));
    });

    it("should rename keys of an array of objects.", async () => {
        await given({
            source: [
                { a: 1, b: 2 },
                { a: 3, b: 4 },
            ],
            keyMap: { a: "c" },
        })
            // @ts-expect-error: Test case for array input, readonly mismatch
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) =>
                expect(res).toEqual([
                    { c: 1, b: 2 },
                    { c: 3, b: 4 },
                ])
            );
    });

    it("should return the original source if it's not a plain object.", async () => {
        const keyMap = { a: "A" };
        await given({ source: "string", keyMap })
            // @ts-expect-error: Test case for non-object input
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toBe("string"));

        await given({ source: null, keyMap })
            // @ts-expect-error: Test case for null input
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toBe(null));

        await given({ source: undefined, keyMap })
            // @ts-expect-error: Test case for undefined input
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toBe(undefined));

        await given({ source: 123, keyMap })
            // @ts-expect-error: Test case for number input
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toBe(123));
    });

    it("should return an empty object when the input is an empty object.", async () => {
        await given({ source: {}, keyMap: { a: "A" } })
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toEqual({}));
    });

    it("should return an empty array when the input is an empty array.", async () => {
        await given({ source: [], keyMap: { a: "A" } })
            // @ts-expect-error: Test case for empty array input
            .when(({ source, keyMap }) => renameKey(source, keyMap))
            .then((res) => expect(res).toEqual([]));
    });
});

describe("deepRenameKey", () => {
    it("should recursively rename keys of nested objects.", async () => {
        await given({
            source: { a: 1, b: { a: 2, c: { a: 3, d: 4 } }, e: [{ a: 5 }] },
            keyMap: { a: "A" },
        })
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) =>
                expect(res).toEqual({
                    A: 1,
                    b: { A: 2, c: { A: 3, d: 4 } },
                    e: [{ A: 5 }],
                })
            );
    });

    it("should recursively rename keys of nested arrays of objects.", async () => {
        await given({
            source: [
                { a: 1, b: { a: 2 } },
                { a: 3, b: { a: 4 } },
            ],
            keyMap: { a: "c" },
        })
            // @ts-expect-error: Test case for array input, readonly mismatch
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) =>
                expect(res).toEqual([
                    { c: 1, b: { c: 2 } },
                    { c: 3, b: { c: 4 } },
                ])
            );
    });

    it("should return the original source if it's not a plain object.", async () => {
        const keyMap = { a: "A" };
        await given({ source: "not an object", keyMap })
            // @ts-expect-error: Test case for non-object input
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toBe("not an object"));

        await given({ source: null, keyMap })
            // @ts-expect-error: Test case for null input
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toBe(null));

        await given({ source: undefined, keyMap })
            // @ts-expect-error: Test case for undefined input
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toBe(undefined));

        await given({ source: 123, keyMap })
            // @ts-expect-error: Test case for number input
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toBe(123));
    });

    it("should keep non-plain object values within nested structures unchanged.", async () => {
        await given({
            source: { a: 1, b: null, c: undefined, d: [1, "two", null] },
            keyMap: { a: "A", b: "B", c: "C", d: "D" },
        })
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) =>
                expect(res).toEqual({
                    A: 1,
                    B: null,
                    C: undefined,
                    D: [1, "two", null],
                })
            );
    });

    it("should return an empty object when the input is an empty object.", async () => {
        await given({ source: {}, keyMap: { a: "A" } })
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toEqual({}));
    });

    it("should return an empty array when the input is an empty array.", async () => {
        await given({ source: [], keyMap: { a: "A" } })
            // @ts-expect-error: Test case for empty array input
            .when(({ source, keyMap }) => deepRenameKey(source, keyMap))
            .then((res) => expect(res).toEqual([]));
    });
});

import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { isKeyedArray, isKeyedRecord } from "./predicate";

describe("isKeyedArray", () => {
    it("should return true for an array of objects with the key as string", async () => {
        await given({
            key: "id",
            value: [
                { id: "u1", name: "lyght" },
                { id: "u2", name: "yj" },
            ],
        })
            .when(({ key, value }) => isKeyedArray(key, value))
            .then((result) => {
                expect(result).toBe(true);
            });
    });

    it("should return false for an array of objects missing the key", async () => {
        await given({ key: "id", value: [{ name: "lyght" }, { id: "u2", name: "yj" }] })
            .when(({ key, value }) => isKeyedArray(key, value))
            .then((result) => {
                expect(result).toBe(false);
            });
    });

    it("should return false for non-array values", async () => {
        await given({ key: "id", value: { id: "u1", name: "lyght" } })
            .when(({ key, value }) => isKeyedArray(key, value))
            .then((result) => {
                expect(result).toBe(false);
            });
    });

    it("should return false for array with non-object items", async () => {
        await given({ key: "id", value: [1, 2, 3] })
            .when(({ key, value }) => isKeyedArray(key, value))
            .then((result) => {
                expect(result).toBe(false);
            });
    });
});

describe("isKeyedRecord", () => {
    it("should return true for a record of objects with the key as string", async () => {
        await given({
            key: "id",
            value: { u1: { id: "u1", name: "lyght" }, u2: { id: "u2", name: "yj" } },
        })
            .when(({ key, value }) => isKeyedRecord(key, value))
            .then((result) => {
                expect(result).toBe(true);
            });
    });

    it("should return false for an array input", async () => {
        await given({ key: "id", value: [{ id: "u1", name: "lyght" }] })
            .when(({ key, value }) => isKeyedRecord(key, value))
            .then((result) => {
                expect(result).toBe(false);
            });
    });

    it("should return false for record with non-object values", async () => {
        await given({ key: "id", value: { u1: 519, u2: 333 } })
            .when(({ key, value }) => isKeyedRecord(key, value))
            .then((result) => {
                expect(result).toBe(false);
            });
    });

    it("should return false for null or non-object values", async () => {
        await given
            .each([
                { key: "id", value: null },
                { key: "id", value: 519 },
            ])
            .when(({ key, value }) => isKeyedRecord(key, value))
            .then((result) => {
                expect(result).toEqual([false, false]);
            });
    });
});

import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { keyedArrayToRecord, keyedArrayToRecordWithoutKey, keyedRecordToArray } from "./convert";

describe("keyedRecordToArray", () => {
    it("should convert a record to an array with key injected", async () => {
        await given({
            key: "id",
            record: {
                u1: { name: "lyght" },
                u2: { name: "yj" },
            },
        })
            .when(({ key, record }) => keyedRecordToArray(key, record))
            .then((result) => {
                expect(result).toEqual([
                    { id: "u1", name: "lyght" },
                    { id: "u2", name: "yj" },
                ]);
            });
    });

    it("should return an empty array for an empty record", async () => {
        await given({ key: "id", record: {} })
            .when(({ key, record }) => keyedRecordToArray(key, record))
            .then((result) => {
                expect(result).toEqual([]);
            });
    });
});

describe("keyedArrayToRecord", () => {
    it("should convert an array to a record with key as property", async () => {
        await given({
            key: "id",
            array: [
                { id: "u1", name: "lyght" },
                { id: "u2", name: "yj" },
            ],
        })
            // @ts-expect-error - test type guard
            .when(({ key, array }) => keyedArrayToRecord(key, array))
            .then((result) => {
                expect(result).toEqual({
                    u1: { id: "u1", name: "lyght" },
                    u2: { id: "u2", name: "yj" },
                });
            });
    });

    it("should return an empty record for an empty array", async () => {
        await given({ key: "id", array: [] })
            // @ts-expect-error - test type guard
            .when(({ key, array }) => keyedArrayToRecord(key, array))
            .then((result) => {
                expect(result).toEqual({});
            });
    });
});

describe("keyedArrayToRecordWithoutKey", () => {
    it("should convert an array to a record without key property in value", async () => {
        await given({
            key: "id",
            array: [
                { id: "u1", name: "lyght" },
                { id: "u2", name: "yj" },
            ],
        })
            // @ts-expect-error - test type guard
            .when(({ key, array }) => keyedArrayToRecordWithoutKey(key, array))
            .then((result) => {
                expect(result).toEqual({
                    u1: { name: "lyght" },
                    u2: { name: "yj" },
                });
            });
    });

    it("should return an empty record for an empty array", async () => {
        await given({ key: "id", array: [] })
            // @ts-expect-error - test type guard
            .when(({ key, array }) => keyedArrayToRecordWithoutKey(key, array))
            .then((result) => {
                expect(result).toEqual({});
            });
    });
});

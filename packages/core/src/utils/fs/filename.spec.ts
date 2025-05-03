import { InvalidTypeError } from "@/errors";
import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { isValidFilename, safeFilename } from "./filename";

describe("isValidFilename", () => {
    it("should return true for a normal filename", async () => {
        await given("hello.txt")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(true));
    });

    it("should return false for a filename with invalid characters", async () => {
        await given
            .each(["inva<lid>.txt", "bad|name.txt", "bad\u0000name.txt", "", ".", ".."])
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toEqual([false, false, false, false, false, false]));
    });
});

describe("safeFilename", () => {
    it("should return the filename if it is valid", async () => {
        await given("good.txt")
            .when((name) => safeFilename(name))
            .then((result) => expect(result).toEqual("good.txt"));
    });

    it("should throw InvalidTypeError for invalid characters", async () => {
        await given
            .each(["bad:name.txt", "bad\u0001name.txt", "", ".", ".."])
            .when((name) => safeFilename(name))
            .catch((errors) =>
                errors.forEach((e) => {
                    expect(e).toBeInstanceOf(InvalidTypeError);
                })
            );
    });
});

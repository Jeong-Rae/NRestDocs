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
        await given("inva<lid>.txt")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
        await given("bad|name.txt")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
    });

    it("should return false for a filename with control characters", async () => {
        await given("bad\u0000name.txt")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
    });

    it("should return false for empty string, '.' and '..'", async () => {
        await given("")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
        await given(".")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
        await given("..")
            .when((name) => isValidFilename(name))
            .then((result) => expect(result).toBe(false));
    });
});

describe("safeFilename", () => {
    it("should return the filename if it is valid", async () => {
        await given("good.txt")
            .when((name) => safeFilename(name))
            .then((result) => expect(result).toBe("good.txt"));
    });

    it("should throw InvalidTypeError for invalid characters", async () => {
        await given("bad:name.txt")
            .when((name) => () => safeFilename(name))
            .catch((err) => expect(err).toBeInstanceOf(InvalidTypeError));
    });

    it("should throw InvalidTypeError for control characters", async () => {
        await given("bad\u0001name.txt")
            .when((name) => () => safeFilename(name))
            .catch((err) => expect(err).toBeInstanceOf(InvalidTypeError));
    });

    it("should throw InvalidTypeError for empty string, '.' and '..'", async () => {
        for (const name of ["", ".", ".."] as const) {
            await given(name)
                .when((n) => () => safeFilename(n))
                .catch((err) => expect(err).toBeInstanceOf(InvalidTypeError));
        }
    });
});

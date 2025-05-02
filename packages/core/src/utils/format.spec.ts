import { describe, expect, it } from "vitest";
import { formatJson } from "./format";
import { given } from "./test";

describe("formatJson", () => {
    it("should format JSON with default spacing when only value is provided.", async () => {
        const value = { username: "lyght", password: "519" };
        const expected = JSON.stringify(value, null, 2);

        await given({ value })
            .when(({ value }) => formatJson(value))
            .then((res) => expect(res).toBe(expected));
    });

    it("should format JSON using the replacer function with default spacing.", async () => {
        const value = { username: "lyght", password: "519", role: "admin" };
        const replacer = (key: string, value: unknown) => (key === "password" ? undefined : value);
        const expectedObject = { username: "lyght", role: "admin" };
        const expected = JSON.stringify(expectedObject, replacer, 2);

        await given({ value, options: { replacer } })
            .when(({ value, options }) => formatJson(value, options))
            .then((res) => expect(res).toBe(expected));
    });

    it("should format JSON with the specified space.", async () => {
        const value = { user: { username: "lyght", password: "519" } };
        const space = 4;
        const expected = JSON.stringify(value, null, space);

        await given({ value, options: { space } })
            .when(({ value, options }) => formatJson(value, options))
            .then((res) => expect(res).toBe(expected));
    });

    it("should format JSON using both replacer and specified space.", async () => {
        const value = { username: "lyght", password: "519", settings: { theme: "dark" } };
        const replacer = (key: string, value: unknown) => (key === "password" ? undefined : value);
        const space = 0;
        const expectedObject = { username: "lyght", settings: { theme: "dark" } };
        const expected = JSON.stringify(expectedObject, replacer, space);

        await given({ value, options: { replacer, space } })
            .when(({ value, options }) => formatJson(value, options))
            .then((res) => expect(res).toBe(expected));
    });

    it("should handle empty object with default options.", async () => {
        const value = {};
        const expected = JSON.stringify(value, null, 2);

        await given({ value })
            .when(({ value }) => formatJson(value))
            .then((res) => expect(res).toBe(expected));
    });

    it("should handle empty object with custom space.", async () => {
        const value = {};
        const space = 4;
        const expected = JSON.stringify(value, null, space);

        await given({ value, options: { space } })
            .when(({ value, options }) => formatJson(value, options))
            .then((res) => expect(res).toBe(expected));
    });
});

import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { E_UNEXPECTED_FIELD, UnexpectedFieldError } from "./unexpected-field-error";

describe("UnexpectedFieldError", () => {
    it("should serialize extraFields correctly", async () => {
        await given({
            options: {
                context: "UserController.create",
                extraFields: ["isAdmin", "token"],
            },
        })
            .when(({ options }) => new UnexpectedFieldError(options))
            .then((error) => {
                expect(error.code).toBe(E_UNEXPECTED_FIELD);
                expect(error.extraFields).toEqual(["isAdmin", "token"]);
            });
    });
});

import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { E_MISSING_FIELD, MissingFieldError } from "./missing-field-error";

describe("MissingFieldError", () => {
    describe("MissingFieldError()", () => {
        it("should set reason, suggestion, and code correctly", async () => {
            await given({
                context: "DocumentBuilder.doc",
                fieldName: "httpRequestPath",
                suggestion: "Call `setRequestPath()` before invoking `doc()`.",
            })
                .when((opts) => new MissingFieldError(opts))
                .then((error) => {
                    expect(error.code).toBe(E_MISSING_FIELD);
                    expect(error.reason).toContain("httpRequestPath");
                    expect(error.suggestion).toBe(
                        "Call `setRequestPath()` before invoking `doc()`."
                    );
                    expect(error.data?.fieldName).toBe("httpRequestPath");
                });
        });
    });
});

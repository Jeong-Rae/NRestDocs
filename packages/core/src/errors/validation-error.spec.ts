import { given } from "@/utils/test/given";
import { describe, expect, it } from "vitest";
import { E_VALIDATION_FAILED, ValidationError } from "./validation-error";

describe("ValidationError()", () => {
    it("should preserve child errors and provide flattenMessages()", async () => {
        await given({
            context: "UserService.save",
            errors: [new Error("plain error"), new Error("plain error")],
            summary: "2개 항목이 유효성 검증에 실패했습니다.",
        })
            .when(
                ({ context, errors, summary }) => new ValidationError({ context, errors, summary })
            )
            .then((error) => {
                // Then
                expect(error.code).toBe(E_VALIDATION_FAILED);
                expect(error.errors).toHaveLength(2);
                expect(error.flattenMessages()).toContain("plain error");
                expect(JSON.parse(JSON.stringify(error)).data.errors).toHaveLength(2);
            });
    });
});

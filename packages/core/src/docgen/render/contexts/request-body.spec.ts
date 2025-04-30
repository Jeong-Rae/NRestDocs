import type { DocumentSnapshot } from "@/docgen/builders";
import { describe, expect, it } from "vitest";
import { buildRequestBodyContext } from "./request-body";

describe("buildRequestBodyContext", () => {
    it("should return newline when requestBody is empty", () => {
        const snapshot = { http: {} } as unknown as DocumentSnapshot;
        const ctx = buildRequestBodyContext(snapshot);
        expect(ctx.body).toBe("\n");
    });

    it("should build pretty JSON body when requestBody is present", () => {
        const snapshot = {
            http: {
                requestBody: { foo: "bar", num: 519 },
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildRequestBodyContext(snapshot);
        expect(ctx.body).toBe(`{
  "foo": "bar",
  "num": 519
}
`);
    });
});

import type { DocumentSnapshot } from "@/builders";
import { describe, expect, it } from "vitest";
import { buildHttpRequestBodyContext } from "./http-request-body";

describe("buildHttpRequestBodyContext", () => {
    it("should return newline when requestBody is empty", () => {
        const snapshot = { http: {} } as unknown as DocumentSnapshot;
        const ctx = buildHttpRequestBodyContext(snapshot);
        expect(ctx.body).toBe("\n");
    });

    it("should build pretty JSON body when requestBody is present", () => {
        const snapshot = {
            http: {
                requestBody: { foo: "bar", num: 519 },
            },
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestBodyContext(snapshot);
        expect(ctx.body).toBe(`{
  "foo": "bar",
  "num": 519
}
`);
    });
});

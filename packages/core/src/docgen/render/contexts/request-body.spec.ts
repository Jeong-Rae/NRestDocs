import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildRequestBodyContext } from "./request-body";

describe("buildRequestBodyContext", () => {
    it("should return newline when requestBody is empty", async () => {
        const snapshot = { http: {} };

        await given({ snapshot })
            .when(({ snapshot }) => buildRequestBodyContext(snapshot as DocumentSnapshot))
            .then(({ context }) => {
                expect(context.language).toBe("json");
                expect(context.body).toBe("\n");
            });
    });

    it("should build pretty JSON body when requestBody is present", async () => {
        const snapshot = {
            http: {
                requestBody: { foo: "bar", num: 519 },
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildRequestBodyContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.language).toBe("json");
                expect(context.body).toBe(`{
  "foo": "bar",
  "num": 519
}
`);
            });
    });
});

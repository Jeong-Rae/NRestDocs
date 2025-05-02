import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildResponseBodyContext } from "./response-body";

describe("buildResponseBodyContext", () => {
    it("should return newline when requestBody is empty", async () => {
        const snapshot = { http: {} } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseBodyContext(snapshot))
            .then(({ context }) => {
                expect(context.language).toBe("json");
                expect(context.body).toBe("");
            });
    });

    it("should build pretty JSON body when requestBody is present", async () => {
        const snapshot = {
            http: {
                responseBody: { username: "lyght", id: 519 },
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildResponseBodyContext(snapshot))
            .then(({ context }) => {
                expect(context.language).toBe("json");
                expect(context.body).toEqual(formatJson(snapshot.http.responseBody));
            });
    });
});

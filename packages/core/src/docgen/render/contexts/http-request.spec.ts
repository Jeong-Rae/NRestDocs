import type { DocumentSnapshot } from "@/docgen/builders";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildHttpRequestContext } from "./http-request";

describe("buildHttpRequestContext", () => {
    it("should build context by assigning method, path, headers, and body from snapshot", async () => {
        const snapshot = {
            http: {
                method: "POST",
                url: new URL("https://api.example.com/users/519"),
                requestHeaders: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer token",
                },
                requestBody: {
                    username: "lyght",
                    password: "secret",
                },
            },
        };

        await given({ snapshot })
            .when(({ snapshot }) =>
                buildHttpRequestContext(snapshot as unknown as DocumentSnapshot)
            )
            .then(({ context }) => {
                expect(context.method).toBe("POST");
                expect(context.path).toBe("/users/519");
                expect(context.headers).toEqual({
                    "Content-Type": "application/json",
                    Authorization: "Bearer token",
                });
                expect(context.body).toEqual({
                    username: "lyght",
                    password: "secret",
                });
            });
    });
});

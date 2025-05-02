import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildHttpRequestContext } from "./http-request";

describe("buildHttpRequestContext", () => {
    it("should be context with method, path, headers, and formatted body.", async () => {
        const reqBody = { username: "lyght", password: "secret" } as const;

        const snapshot = {
            http: {
                method: "POST",
                url: new URL("https://api.example.com/users/519"),
                requestHeaders: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer token",
                },
                requestBody: reqBody,
            },
        } as unknown as DocumentSnapshot;

        const expectedHeaders = [
            { name: "Content-Type", value: "application/json" },
            { name: "Authorization", value: "Bearer token" },
        ];

        await given({ snapshot })
            .when(({ snapshot }) => buildHttpRequestContext(snapshot))
            .then(({ context }) => {
                expect(context.method).toBe("POST");
                expect(context.path).toBe("/users/519");
                expect(context.headers).toEqual(expectedHeaders);
                expect(context.body).toEqual(formatJson(reqBody));
            });
    });

    it("should be context with empty body string for empty requestBody.", async () => {
        const snapshot = {
            http: {
                method: "GET",
                url: new URL("https://api.example.com/ping"),
                requestHeaders: { Accept: "application/json" },
                requestBody: {},
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildHttpRequestContext(snapshot))
            .then(({ context }) => {
                expect(context.method).toBe("GET");
                expect(context.path).toBe("/ping");
                expect(context.body).toBe("");
            });
    });
});

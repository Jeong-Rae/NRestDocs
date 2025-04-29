import type { DocumentSnapshot } from "@/builders";
import { describe, expect, it } from "vitest";
import { buildHttpRequestContext } from "./http-request";

describe("buildHttpRequestContext", () => {
    it("should build context by assigning method, path, headers, and body from snapshot", () => {
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
        } as unknown as DocumentSnapshot;

        const ctx = buildHttpRequestContext(snapshot);

        expect(ctx.method).toBe("POST");
        expect(ctx.path).toBe("/users/519");
        expect(ctx.headers).toEqual({
            "Content-Type": "application/json",
            Authorization: "Bearer token",
        });
        expect(ctx.body).toEqual({
            username: "lyght",
            password: "secret",
        });
    });
});

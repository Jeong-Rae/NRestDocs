import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { given } from "@/utils/test";
import { describe, expect, it } from "vitest";
import { buildHttpResponseContext } from "./http-response";

describe("buildHttpResponseContext", () => {
    it("should be context with status, reason, headers, and formatted body.", async () => {
        const resBody = { id: 519, name: "lyght" };

        const snapshot = {
            http: {
                statusCode: 201,
                responseHeaders: {
                    "Content-Type": "application/json",
                    "X-Request-ID": "abc123",
                },
                responseBody: resBody,
            },
        } as unknown as DocumentSnapshot;

        const expectedHeaders = [
            { name: "Content-Type", value: "application/json" },
            { name: "X-Request-ID", value: "abc123" },
        ];

        await given({ snapshot })
            .when(({ snapshot }) => buildHttpResponseContext(snapshot))
            .then(({ context }) => {
                expect(context.statusCode).toBe(201);
                expect(context.statusReason).toBe("Created");
                expect(context.headers).toEqual(expectedHeaders);
                expect(context.body).toEqual(formatJson(resBody));
            });
    });

    it("should be context with empty body string for empty responseBody.", async () => {
        const snapshot = {
            http: {
                statusCode: 204,
                responseHeaders: { "X-Request-ID": "no-content" },
                responseBody: {},
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildHttpResponseContext(snapshot))
            .then(({ context }) => {
                expect(context.statusCode).toBe(204);
                expect(context.statusReason).toBe("No Content");
                expect(context.body).toEqual("");
            });
    });

    it("should be context with empty statusReason for invalid status code.", async () => {
        const snapshot = {
            http: {
                statusCode: 999,
            },
        } as unknown as DocumentSnapshot;

        await given({ snapshot })
            .when(({ snapshot }) => buildHttpResponseContext(snapshot))
            .then(({ context }) => {
                expect(context.statusCode).toBe(999);
                expect(context.statusReason).toBe("");
            });
    });
});

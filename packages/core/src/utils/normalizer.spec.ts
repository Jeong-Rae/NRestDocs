import { ParamKinds, pathParam, queryParam } from "@/descriptors";
import { describe, expect, it } from "vitest";
import { applyNormalize } from "./parameter-normalizer";
import { given } from "./test";

describe("parameter-normalizer", () => {
    describe("applyNormalize", () => {
        describe("path parameters", () => {
            it("fills missing type with default 'string'", async () => {
                await given([{ name: "userId" }])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Path, input as any))
                    .then((result) => {
                        const desc = result[0];
                        expect(desc.name).toBe("userId");
                        expect(desc.type).toBe("string");
                    });
            });

            it("applies optional flag when set", async () => {
                await given([{ name: "orderId", optional: true }])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Path, input as any))
                    .then((result) => {
                        const desc = result[0];
                        expect(desc.name).toBe("orderId");
                        expect(desc.optional).toBe(true);
                        expect(desc.type).toBe("string");
                    });
            });

            it("calls build() on Builder instances", async () => {
                await given([pathParam("commentId").type("string")])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Path, input as any))
                    .then((result) => {
                        const desc = result[0];
                        expect(desc.name).toBe("commentId");
                        expect(desc.type).toBe("string");
                    });
            });

            it("maps record keys to names", async () => {
                await given({
                    articleId: {},
                    replyId: { optional: true },
                })
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Path, input as any))
                    .then((result) => {
                        expect(result.map((r) => r.name).sort()).toEqual(["articleId", "replyId"]);
                        expect(result.find((r) => r.name === "replyId")?.optional).toBe(true);
                    });
            });
        });

        describe("query parameters", () => {
            it("fills missing type with default 'string'", async () => {
                await given([{ name: "searchTerm" }])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Query, input as any))
                    .then((result) => {
                        const desc = result[0];
                        expect(desc.name).toBe("searchTerm");
                        expect(desc.type).toBe("string");
                    });
            });

            it("applies optional flag correctly", async () => {
                await given([{ name: "page", optional: true }])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Query, input as any))
                    .then((result) => {
                        const desc = result[0];
                        expect(desc.name).toBe("page");
                        expect(desc.optional).toBe(true);
                        expect(desc.type).toBe("string"); // 기본 string
                    });
            });

            it("calls build() on Builder instances", async () => {
                await given([queryParam("q").description("검색어"), queryParam("sort").optional()])
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Query, input as any))
                    .then((result) => {
                        expect(result.map((r) => r.name).sort()).toEqual(["q", "sort"]);
                        expect(result.find((r) => r.name === "q")?.description).toBe("검색어");
                    });
            });

            it("maps record keys to names", async () => {
                await given({
                    limit: {},
                    offset: { optional: true },
                })
                    // biome-ignore lint/suspicious/noExplicitAny: Test setup requires flexibility
                    .when((input) => applyNormalize(ParamKinds.Query, input as any))
                    .then((result) => {
                        expect(result.map((r) => r.name).sort()).toEqual(["limit", "offset"]);
                        expect(result.find((r) => r.name === "offset")?.optional).toBe(true);
                    });
            });
        });
    });
});

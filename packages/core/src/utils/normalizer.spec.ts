import { describe, expect, it } from "vitest";

import { type AllowedType, type BaseDescriptor, DescriptorKinds } from "@/core";
import type { DescriptorKind, FormatFor } from "@/core";
import type { DescriptorBuilder } from "@/descriptors";
import type { TypeSet, TypeUnset } from "@/descriptors/state";
import { applyNormalize } from "@/utils/normalizer";
import { given } from "@/utils/test/given";

function mockBuilder<
    K extends DescriptorKind,
    N extends string,
    D extends BaseDescriptor<K, AllowedType<K>>,
>(kind: K, name: N, partial: Partial<D> = {}): DescriptorBuilder<Partial<D>, TypeUnset, K> {
    const draft = { kind, name, ...partial } as Partial<D>;
    return {
        type(t: AllowedType<K>) {
            return mockBuilder(kind, name, { ...draft, type: t });
        },
        format(f: FormatFor<AllowedType<K>>) {
            return mockBuilder(kind, name, { ...draft, format: f });
        },
        description(desc: string) {
            return mockBuilder(kind, name, { ...draft, description: desc });
        },
        optional() {
            return mockBuilder(kind, name, { ...draft, optional: true });
        },
        build() {
            return draft as D;
        },
    } as unknown as DescriptorBuilder<Partial<D>, TypeSet, K>;
}

describe("applyNormalize", () => {
    const KIND = DescriptorKinds.Query;

    it("normalizes a single builder", async () => {
        await given(mockBuilder(KIND, "q").type("string"))
            .when((input) => applyNormalize(KIND, input))
            .then(([desc]) => {
                expect(desc).toEqual({
                    kind: KIND,
                    name: "q",
                    type: "string",
                    description: "",
                });
            });
    });

    it("normalizes an array of builders", async () => {
        await given([mockBuilder(KIND, "limit"), mockBuilder(KIND, "offset").optional()])
            // biome-ignore lint/suspicious/noExplicitAny: test
            .when((input) => applyNormalize(KIND, input as any))
            .then((res) => {
                expect(res).toHaveLength(2);
                expect(res[0].name).toBe("limit");
                expect(res[1].name).toBe("offset");
                expect(res[1].optional).toBe(true);
            });
    });

    it("normalizes a single descriptor (fills defaults)", async () => {
        await given({ name: "searchTerm" })
            // biome-ignore lint/suspicious/noExplicitAny: test
            .when((input) => applyNormalize(KIND, input as any))
            .then(([desc]) => {
                expect(desc.type).toBe("string");
                expect(desc.description).toBe("");
            });
    });

    it("normalizes an array of descriptors", async () => {
        await given([
            { name: "page", type: "number" },
            { name: "sort", optional: true },
        ])
            // biome-ignore lint/suspicious/noExplicitAny: test
            .when((input) => applyNormalize(KIND, input as any))
            .then((res) => {
                expect(res).toHaveLength(2);
                expect(res[0].name).toBe("page");
                expect(res[0].type).toBe("number");
                expect(res[1].name).toBe("sort");
                expect(res[1].type).toBe("string");
            });
    });

    it("normalizes a record of descriptors", async () => {
        await given({
            q: {},
            page: { type: "number" },
        })
            // biome-ignore lint/suspicious/noExplicitAny: test
            .when((input) => applyNormalize(KIND, input as any))
            .then((res) => {
                expect(res).toHaveLength(2);
                expect(res[0].name).toBe("q");
                expect(res[0].type).toBe("string");
                expect(res[1].name).toBe("page");
                expect(res[1].type).toBe("number");
            });
    });

    it("normalizes a builder with format", async () => {
        await given(mockBuilder(KIND, "date").type("string").format("date-time"))
            .when((input) => applyNormalize(KIND, input))
            .then(([desc]) => {
                expect(desc).toEqual({
                    kind: KIND,
                    name: "date",
                    type: "string",
                    format: "date-time",
                    description: "",
                });
            });
    });
});

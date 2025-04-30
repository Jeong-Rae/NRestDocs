import type { AllowedType, BaseDescriptor, DescriptorKind } from "@/core";
import type { DescriptorBuilder } from "@/descriptors";
import type { TypeSet } from "@/descriptors/state";
import type { DescriptorInput, PartialDescriptor } from "@/inputs";
import { isKeyedRecord, keyedRecordToArray } from "@/types/collection";
import { isBuilder } from "./is-builder";
import Logger from "./logger";

function withDefaults<K extends DescriptorKind>(
    kind: K,
    descriptor: Partial<BaseDescriptor<K, AllowedType<K>>>
): BaseDescriptor<K, AllowedType<K>> {
    const { name, type = "string", description = "", optional, format } = descriptor;

    return {
        kind,
        name: name!,
        type: type as AllowedType<K>,
        description,
        ...(format && { format }),
        ...(optional && { optional }),
    };
}

function toDescriptor<K extends DescriptorKind, D extends BaseDescriptor<K, AllowedType<K>>>(
    kind: K,
    raw: DescriptorBuilder<Partial<D>, TypeSet, K> | PartialDescriptor<K, D>
): D {
    const partial = isBuilder(raw) ? raw.build() : raw;
    return withDefaults(kind, partial) as D;
}

function normalizeToArray<K extends DescriptorKind, D extends BaseDescriptor<K, AllowedType<K>>>(
    input: DescriptorInput<K, D>
): Array<PartialDescriptor<K, D> | DescriptorBuilder<Partial<D>, TypeSet, K>> {
    if (isKeyedRecord("name", input)) {
        return keyedRecordToArray("name", input);
    }
    return Array.isArray(input) ? input : [input];
}

export function applyNormalize<
    K extends DescriptorKind,
    D extends BaseDescriptor<K, AllowedType<K>>,
>(kind: K, input: DescriptorInput<K, D>): D[] {
    Logger.info(isKeyedRecord("name", { q: {}, page: { type: "number" } }));
    const arrayInput = normalizeToArray(input);
    return arrayInput.map((item) => toDescriptor(kind, item));
}

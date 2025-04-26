import type { AllowedType, BaseDescriptor, Builder, ParamKind, TypeSet } from "@/descriptors";
import type { ArrayOrRecord, PartialDescriptor } from "@/inputs";
import { isArray } from "es-toolkit/compat";
import { isBuilder } from "./isBuilder";

function addDefaultType<K extends ParamKind>(
    kind: K,
    descriptor: Partial<BaseDescriptor<K, AllowedType<K>>>
): BaseDescriptor<K, AllowedType<K>> {
    const { name, type = "string", description = "", optional } = descriptor;
    return {
        kind,
        name: name!,
        type: type as AllowedType<K>,
        description,
        ...(optional && { optional: true }),
    };
}

function normalizeOne<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>>(
    kind: K,
    raw: { build?: () => D } | PartialDescriptor<K, D>
): D {
    //  빌더일 경우 build() 호출
    if (isBuilder<Builder<D, TypeSet, K>>(raw)) {
        const built = raw.build();
        return addDefaultType(kind, built) as D;
    }

    const { name, type = "string", description = "", optional } = raw as PartialDescriptor<K, D>;
    return {
        kind,
        name,
        type,
        description,
        ...(optional && { optional: true }),
    } as D;
}

export function applyNormalize<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>>(
    kind: K,
    input: ArrayOrRecord<K, D>
): D[] {
    if (isArray(input)) {
        return input.map((item) => normalizeOne(kind, item) as D);
    }
    return Object.entries(input).map(
        ([name, rest]) => normalizeOne(kind, { name, ...rest } as PartialDescriptor<K, D>) as D
    );
}

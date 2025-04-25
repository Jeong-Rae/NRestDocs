import { isArray, isFunction } from "es-toolkit/compat";
import type { AllowedType, BaseDescriptor, Builder, ParamKind, TypeSet } from "../descriptors";

type PartialDescriptor<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>> = Partial<
    Omit<D, "kind">
> & { name: string };

export type ArrayOrRecord<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>> =
    | (Builder<Partial<D>, TypeSet, K> | PartialDescriptor<K, D>)[]
    | Record<string, Omit<PartialDescriptor<K, D>, "name">>;

function normalizeOne<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>>(
    kind: K,
    raw: { build?: () => D } | PartialDescriptor<K, D>
): D {
    //  빌더일 경우 build() 호출
    if (isFunction((raw as Record<string, unknown>)["build"])) {
        return (raw as Builder<D, TypeSet, K>).build();
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

export function applyParameters<K extends ParamKind, D extends BaseDescriptor<K, AllowedType<K>>>(
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

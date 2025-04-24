import { isArray, isFunction } from "es-toolkit/compat";
import type { BaseDescriptor, Builder, FieldType, ParamKind, TypeSet } from "../descriptors";

type PartialDescriptor<K extends ParamKind, D extends BaseDescriptor<K>> = Partial<
    Omit<D, "kind">
> & { name: string };

type ArrayOrRecord<K extends ParamKind, D extends BaseDescriptor<K>> =
    | (Builder<Partial<D>, TypeSet, K> | PartialDescriptor<K, D>)[]
    | Record<string, Omit<PartialDescriptor<K, D>, "name">>;

function normalizeOne<K extends ParamKind, D extends BaseDescriptor<K>>(
    kind: K,
    raw: { build?: () => D } | PartialDescriptor<K, D>
): D {
    // 빌더라면 build() 호출
    if (isFunction((raw as Record<string, unknown>)["build"])) {
        return (raw as Builder<D, TypeSet, K>).build();
    }
    // Partial 객체일 때 기존 로직
    const descriptor = raw as PartialDescriptor<K, D>;
    return {
        kind,
        name: descriptor.name,
        type: (descriptor.type ?? "string") as FieldType,
        description: descriptor.description ?? "",
        ...(descriptor.optional && { optional: true }),
    } as D;
}

export function applyParameters<K extends ParamKind, D extends BaseDescriptor<K>>(
    kind: K,
    input: ArrayOrRecord<K, D>
): D[] {
    if (isArray(input)) {
        return input.map((item) => normalizeOne(kind, item)) as D[];
    }
    return Object.entries(input).map(([name, rest]) =>
        normalizeOne(kind, { name, ...rest } as PartialDescriptor<K, D>)
    ) as D[];
}

export const makeApply =
    <K extends ParamKind>() =>
    <D extends BaseDescriptor<K>>(kind: K) =>
    (input: ArrayOrRecord<K, D>) =>
        applyParameters<K, D>(kind, input);

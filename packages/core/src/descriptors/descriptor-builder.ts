import type { AllowedType, BaseDescriptor, DescriptorKind, FormatFor } from "@/core";
import type { TypeSet, TypeUnset } from "./state";

type EnsureDescriptor<
    K extends DescriptorKind,
    T extends Partial<BaseDescriptor<K, AllowedType<K>>>,
> = T & {
    kind: K;
    name: string;
    type: AllowedType<K>;
};

export interface DescriptorBuilder<
    D extends Partial<BaseDescriptor<K, AllowedType<K>>>,
    S,
    K extends DescriptorKind,
> {
    type<T extends AllowedType<K>>(
        type: T
    ): DescriptorBuilder<Omit<D, "type" | "format"> & { type: T }, TypeSet, K>;

    format<T extends NonNullable<D["type"]>, F extends FormatFor<T & AllowedType<K>>>(
        format: F
    ): DescriptorBuilder<D & { format: F }, TypeSet, K>;

    description(text: string): DescriptorBuilder<D & { description: string }, S, K>;

    optional(): DescriptorBuilder<D & { optional: true }, S, K>;

    build(): Readonly<EnsureDescriptor<K, D>>;
}

export function createDescriptorBuilder<K extends DescriptorKind, N extends string>(
    kind: K,
    name: N,
    draft: Partial<BaseDescriptor<K, AllowedType<K>>> = { kind, name }
): DescriptorBuilder<typeof draft, TypeUnset, K> {
    const api: unknown = {
        type(t: AllowedType<K>) {
            return createDescriptorBuilder(kind, name, { ...draft, type: t });
        },
        format(f: FormatFor<AllowedType<K>>) {
            return createDescriptorBuilder(kind, name, { ...draft, format: f });
        },
        description(desc: string) {
            return createDescriptorBuilder(kind, name, { ...draft, description: desc });
        },
        optional() {
            return createDescriptorBuilder(kind, name, { ...draft, optional: true });
        },
        build(): Readonly<EnsureDescriptor<K, typeof draft>> {
            return draft as EnsureDescriptor<K, typeof draft>;
        },
    };

    return api as DescriptorBuilder<typeof draft, TypeUnset, K>;
}

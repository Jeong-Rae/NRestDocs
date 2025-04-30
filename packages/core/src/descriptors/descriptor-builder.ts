import type { AllowedType, BaseDescriptor, DescriptorKind, FormatFor } from "@/core";
import type { TypeSet, TypeUnset } from "./state";

/**
 * Descriptor Builder Interface
 * @param D Descriptor
 * @param S State
 * @param K DescriptorKind
 */
export interface DescriptorBuilder<
    D extends Partial<BaseDescriptor<K, AllowedType<K>>>,
    S,
    K extends DescriptorKind,
> {
    // AllowedType by Kind
    type<T extends AllowedType<K>>(
        type: T
    ): DescriptorBuilder<Omit<D, "type" | "format"> & { type: T }, TypeSet, K>;

    // format is available after type is defined
    format<T extends NonNullable<D["type"]>, F extends FormatFor<T & AllowedType<K>>>(
        this: DescriptorBuilder<D & { type: T }, TypeSet, K>,
        format: F
    ): DescriptorBuilder<D & { format: F }, TypeSet, K>;

    description(description: string): DescriptorBuilder<D & { description: string }, S, K>;

    optional(): DescriptorBuilder<D & { optional: true }, S, K>;

    build(
        this: DescriptorBuilder<D & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
    ): Readonly<D & BaseDescriptor<K, AllowedType<K>>>;
}

type Draft<K extends DescriptorKind, N extends string> = Partial<BaseDescriptor<K, AllowedType<K>>>;

/**
 * Create Descriptor Builder
 * @param kind DescriptorKind
 * @param name Descriptor Name
 * @param draft Draft Descriptor
 * @returns Descriptor Builder
 */
export function createDescriptorBuilder<K extends DescriptorKind, N extends string>(
    kind: K,
    name: N,
    draft: Draft<K, N> = { kind, name }
): DescriptorBuilder<typeof draft, TypeUnset, K> {
    const builder: unknown = {
        type(type: AllowedType<K>) {
            return createDescriptorBuilder(kind, name, { ...draft, type });
        },
        format(format: FormatFor<AllowedType<K>>) {
            return createDescriptorBuilder(kind, name, { ...draft, format });
        },
        description(description: string) {
            return createDescriptorBuilder(kind, name, { ...draft, description });
        },
        optional() {
            return createDescriptorBuilder(kind, name, { ...draft, optional: true });
        },
        build(
            this: DescriptorBuilder<typeof draft & BaseDescriptor<K, AllowedType<K>>, TypeSet, K>
        ): Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>> {
            return draft as Readonly<typeof draft & BaseDescriptor<K, AllowedType<K>>>;
        },
    };
    return builder as DescriptorBuilder<typeof draft, TypeUnset, K>;
}

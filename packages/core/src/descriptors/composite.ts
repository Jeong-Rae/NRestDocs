import type { AllowedType, BaseDescriptor, DescriptorKind } from "@/core";
import type { TypeBuilder, TypeSchema } from "./type-builder";

/** 복합 타입 Descriptor */
export interface CompositeDescriptor<K extends DescriptorKind = DescriptorKind> {
    kind: K;
    name: string;
    mode: "oneOf" | "anyOf";
    variants: TypeSchema[];
    description?: string;
    optional?: true;
}

/** Builder 믹스인용 */
export interface CompositeMixin<
    D extends Partial<BaseDescriptor<K, AllowedType<K>>>,
    K extends DescriptorKind,
> {
    oneOf(variants: (TypeBuilder<TypeSchema> | TypeSchema)[]): this;
    anyOf(variants: (TypeBuilder<TypeSchema> | TypeSchema)[]): this;
}

import type { TypeBuilder, TypeSchema } from "./schema";
import type { AllowedType, BaseDescriptor, ParamKind } from "./types";

/** 복합 타입 Descriptor */
export interface CompositeDescriptor<K extends ParamKind = ParamKind> {
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
    K extends ParamKind,
> {
    oneOf(variants: (TypeBuilder<TypeSchema> | TypeSchema)[]): this;
    anyOf(variants: (TypeBuilder<TypeSchema> | TypeSchema)[]): this;
}

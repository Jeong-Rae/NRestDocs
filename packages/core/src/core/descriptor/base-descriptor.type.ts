import type { FormatFor } from "../field/field.type";
import type { AllowedType } from "./allowed-type.type";
import type { DescriptorKind } from "./descriptor-kind.type";

/** Base Descriptor Type */
export type BaseDescriptor<K extends DescriptorKind, T extends AllowedType<K>> = {
    readonly kind: K;
    readonly name: string;
    readonly type: T;
    readonly format?: FormatFor<T>;
    readonly description?: string;
    readonly optional?: true;
};

/* Kind Alias */

export type QueryParamDescriptor = BaseDescriptor<"query", AllowedType<"query">>;
export type FormParamDescriptor = BaseDescriptor<"form", AllowedType<"form">>;
export type PathParamDescriptor = BaseDescriptor<"path", AllowedType<"path">>;
export type HeaderDescriptor = BaseDescriptor<"header", AllowedType<"header">>;
export type CookieDescriptor = BaseDescriptor<"cookie", AllowedType<"cookie">>;
export type PartDescriptor = BaseDescriptor<"part", AllowedType<"part">>;
export type FieldDescriptor = BaseDescriptor<"field", AllowedType<"field">>;

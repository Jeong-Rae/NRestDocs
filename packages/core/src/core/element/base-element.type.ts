import type { FormatFor } from "../field/field.type";
import type { AllowedType } from "./allowed-type.type";
import type { ElementKind } from "./element-kind.type";

/** Base Element Type */
export type BaseElement<K extends ElementKind, T extends AllowedType<K>> = {
    readonly kind: K;
    readonly name: string;
    readonly type: T;
    readonly format?: FormatFor<T>;
    readonly description?: string;
    readonly optional?: true;
};

/* Kind Alias */

export type QueryElement = BaseElement<"query", AllowedType<"query">>;
export type FormElement = BaseElement<"form", AllowedType<"form">>;
export type PathElement = BaseElement<"path", AllowedType<"path">>;
export type HeaderElement = BaseElement<"header", AllowedType<"header">>;
export type CookieElement = BaseElement<"cookie", AllowedType<"cookie">>;
export type PartElement = BaseElement<"part", AllowedType<"part">>;
export type FieldElement = BaseElement<"field", AllowedType<"field">>;

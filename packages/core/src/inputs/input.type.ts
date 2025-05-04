import type {
    AllowedType,
    BaseDescriptor,
    CookieDescriptor,
    DescriptorKind,
    DescriptorKinds,
    FieldDescriptor,
    FormParamDescriptor,
    HeaderDescriptor,
    PartDescriptor,
    PathParamDescriptor,
    QueryParamDescriptor,
} from "@/core";
import type { DescriptorBuilder } from "@/descriptors";
import type { TypeSet } from "@/descriptors/state";
import type { KeyedCollection } from "@/types/keyed-collection.type";

/**
 * Partial Descriptor
 * @param K DescriptorKind
 * @param D Descriptor
 */
export type PartialDescriptor<
    K extends DescriptorKind,
    D extends BaseDescriptor<K, AllowedType<K>>,
> = Partial<Omit<D, "kind">> & { name: string };

type DescriptorItem<K extends DescriptorKind, D extends BaseDescriptor<K, AllowedType<K>>> =
    | PartialDescriptor<K, D>
    | DescriptorBuilder<Partial<D>, TypeSet, K>;

/**
 * Descriptor Input Type
 * @param K DescriptorKind
 * @param D Descriptor
 * @example
 * // single descriptor
 * { name: "id", type: "number" }
 * // array of descriptors
 * [{ name: "id", type: "number" }, { name: "name", type: "string" }]
 * // record of descriptors
 * { id: { type: "number" }, name: { type: "string" } }
 * // descriptor builder
 * defineQuery("id").type("number")
 * // array of descriptor builders
 * [defineQuery("id").type("number"), defineQuery("name").type("string")]
 */
export type DescriptorInput<K extends DescriptorKind, D extends BaseDescriptor<K, AllowedType<K>>> =
    | DescriptorItem<K, D>
    | DescriptorItem<K, D>[]
    | KeyedCollection<"name", PartialDescriptor<K, D>>;

/* Input Type Alias */
export type FieldInput = DescriptorInput<typeof DescriptorKinds.Field, FieldDescriptor>;
export type QueryParamsInput = DescriptorInput<typeof DescriptorKinds.Query, QueryParamDescriptor>;
export type FormParamsInput = DescriptorInput<typeof DescriptorKinds.Form, FormParamDescriptor>;
export type PathParamsInput = DescriptorInput<typeof DescriptorKinds.Path, PathParamDescriptor>;
export type RequestPartInput = DescriptorInput<typeof DescriptorKinds.Part, PartDescriptor>;
export type HeaderInput = DescriptorInput<typeof DescriptorKinds.Header, HeaderDescriptor>;
export type CookieInput = DescriptorInput<typeof DescriptorKinds.Cookie, CookieDescriptor>;

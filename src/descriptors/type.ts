/** 허용되는 타입  */
export type FieldType = "string" | "number" | "boolean" | "integer" | "array" | "object";

/** Descriptor가 공통으로 가지는 필드 */
export interface BaseDescriptor<K extends string = string> {
    readonly kind: K;
    readonly name: string;
    readonly type: FieldType;
    readonly description?: string;
    readonly optional?: true;
}

/** Descriptors */
export type PathParamDescriptor = BaseDescriptor<"path">;
export type QueryParamDescriptor = BaseDescriptor<"query">;
export type HeaderDescriptor = BaseDescriptor<"header">;
export type FieldDescriptor = BaseDescriptor<"field">;
export type PartDescriptor = BaseDescriptor<"part">;

/** ResponseDescriptor */
export type ResponseDescriptor = {
    headers: HeaderDescriptor[];
    fields: FieldDescriptor[];
    description: string;
};

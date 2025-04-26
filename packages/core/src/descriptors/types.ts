export type FieldType = "string" | "number" | "boolean" | "integer" | "array" | "object";

/** Kind별 허용 타입 */
export type AllowedType<K extends ParamKind> = K extends "part"
    ? "string" | "binary"
    : K extends "field"
      ? FieldType
      : "string";

/** 파라미터 Descriptor 종류 */
export const ParamKinds = {
    Query: "query",
    Form: "form",
    Path: "path",
    Header: "header",
    Field: "field",
    Part: "part",
} as const;

export type ParamKind = (typeof ParamKinds)[keyof typeof ParamKinds];

/** Descriptor가 공통으로 가지는 필드 */
export interface BaseDescriptor<K extends ParamKind, T extends string> {
    readonly kind: K;
    readonly name: string;
    readonly type: T;
    readonly description?: string;
    readonly optional?: true;
}

/** Descriptors */
export type QueryParamDescriptor = BaseDescriptor<"query", "string">;
export type FormParamDescriptor = BaseDescriptor<"form", "string">;
export type PathParamDescriptor = BaseDescriptor<"path", "string">;
export type PartDescriptor = BaseDescriptor<"part", "string" | "binary">;
export type HeaderDescriptor = BaseDescriptor<"header", "string">;
export type FieldDescriptor = BaseDescriptor<"field", FieldType>;

/** ResponseDescriptor */
export type ResponseDescriptor = {
    headers: HeaderDescriptor[];
    fields: FieldDescriptor[];
    description: string;
};

/** 허용되는 타입  */
export type FieldType = "string" | "number" | "boolean" | "integer" | "array" | "object";

/** 파라미터 Descriptor 종류 */
export const ParamKinds = {
    Path: "path",
    Query: "query",
    Header: "header",
    Field: "field",
    Part: "part",
} as const;

export type ParamKind = (typeof ParamKinds)[keyof typeof ParamKinds];

/** Descriptor가 공통으로 가지는 필드 */
export interface BaseDescriptor<K extends ParamKind = ParamKind> {
    readonly kind: K;
    readonly name: string;
    readonly type: FieldType;
    readonly description?: string;
    readonly optional?: true;
}

/** Descriptors */
export type PathParamDescriptor = BaseDescriptor<typeof ParamKinds.Path>;
export type QueryParamDescriptor = BaseDescriptor<typeof ParamKinds.Query>;
export type HeaderDescriptor = BaseDescriptor<typeof ParamKinds.Header>;
export type FieldDescriptor = BaseDescriptor<typeof ParamKinds.Field>;
export type PartDescriptor = BaseDescriptor<typeof ParamKinds.Part>;

/** ResponseDescriptor */
export type ResponseDescriptor = {
    headers: HeaderDescriptor[];
    fields: FieldDescriptor[];
    description: string;
};

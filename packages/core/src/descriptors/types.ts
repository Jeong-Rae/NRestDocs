import type { WidenString } from "@/types/widen.type";

export type FieldType = "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";

type StringFormat =
    | "string"
    | "date"
    | "date-time"
    | "binary"
    | "byte"
    | "email"
    | "uuid"
    | "password"
    | "hostname"
    | "ipv4"
    | "ipv6"
    | "uri"
    | "uri-reference"
    | "uri-template"
    | "json-pointer"
    | "relative-json-pointer"
    | "regex";

type IntegerFormat = "integer" | "int32" | "int64";
type NumberFormat = "number" | IntegerFormat | "float" | "double" | "decimal";

export type FormatFor<T extends FieldType> = T extends "string"
    ? WidenString<StringFormat>
    : T extends "integer"
      ? WidenString<IntegerFormat>
      : T extends "number"
        ? WidenString<NumberFormat>
        : T extends "boolean"
          ? "boolean"
          : T extends "object"
            ? WidenString<"object">
            : T extends "array"
              ? WidenString<"array">
              : T extends "null"
                ? "null"
                : never;

/** Kind별 허용 타입 */
export type AllowedType<K extends ParamKind> = K extends "part"
    ? "string"
    : K extends "path"
      ? Exclude<FieldType, "object" | "array" | "null">
      : K extends "query"
        ? FieldType
        : K extends "form"
          ? FieldType
          : K extends "header"
            ? FieldType
            : K extends "field"
              ? FieldType
              : never;

/** Descriptor의 종류 */
export const ParamKinds = {
    Query: "query",
    Form: "form",
    Path: "path",
    Header: "header",
    Field: "field",
    Part: "part",
} as const;
export type ParamKind = (typeof ParamKinds)[keyof typeof ParamKinds];

/** Descriptor 공통 인터페이스 */
export interface BaseDescriptor<K extends ParamKind, T extends AllowedType<K>> {
    readonly kind: K;
    readonly name: string;
    readonly type: T;
    readonly format?: FormatFor<T>;
    readonly description?: string;
    readonly optional?: true;
}

/** Descriptors */
export type QueryParamDescriptor = BaseDescriptor<"query", FieldType>;
export type FormParamDescriptor = BaseDescriptor<"form", FieldType>;
export type PathParamDescriptor = BaseDescriptor<
    "path",
    Exclude<FieldType, "object" | "array" | "null">
>;
export type HeaderDescriptor = BaseDescriptor<"header", FieldType>;
export type PartDescriptor = BaseDescriptor<"part", "string">;
export type FieldDescriptor = BaseDescriptor<"field", FieldType>;

/** ResponseDescriptor */
export type ResponseDescriptor = {
    headers: HeaderDescriptor[];
    fields: FieldDescriptor[];
    description: string;
};

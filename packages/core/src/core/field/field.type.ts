/** Primitive & collection field types */
export type FieldType = "null" | "boolean" | "object" | "array" | "number" | "string" | "integer";

/* Format mapping */

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
    ? StringFormat
    : T extends "integer"
      ? IntegerFormat
      : T extends "number"
        ? NumberFormat
        : T extends "boolean"
          ? "boolean"
          : T extends "object"
            ? "object"
            : T extends "array"
              ? "array"
              : T extends "null"
                ? "null"
                : never;

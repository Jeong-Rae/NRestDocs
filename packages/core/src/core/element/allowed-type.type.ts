import type { FieldType } from "../field/field.type";
import type { ElementKind } from "./element-kind.type";

/** Allowed FieldType for each ElementKind */
export type AllowedType<K extends ElementKind> = K extends "part"
    ? "string"
    : K extends "path"
      ? Exclude<FieldType, "object" | "array" | "null">
      : K extends "cookie" | "query" | "form" | "header" | "field"
        ? FieldType
        : never;

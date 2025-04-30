import type { FieldType } from "../field/field.type";
import type { DescriptorKind } from "./descriptor-kind.type";

/** Allowed FieldType for each DescriptorKind */
export type AllowedType<K extends DescriptorKind> = K extends "part"
    ? "string"
    : K extends "path"
      ? Exclude<FieldType, "object" | "array" | "null">
      : K extends "cookie" | "query" | "form" | "header" | "field"
        ? FieldType
        : never;

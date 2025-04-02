import { FieldDescriptor } from "../../types";
import { format } from "../utils/format";

/**
 * request-fields
 */
export function generateRequestFieldsSnippet(fields: FieldDescriptor[]): string {
    let fieldRows = "";

    fields.forEach((field) => {
        const isOptional = field.optional ? "true" : "false";
        fieldRows += `\n| +${field.name}+ | +${field.type}+ | +${isOptional}+ | ${field.description ?? ""}`;
    });

    return format`
= request-fields

== Request Fields
[cols="3,2,7", options="header"]
|===
| Field | Type | Optional | Description${fieldRows}
|===
`.trimStart();
}

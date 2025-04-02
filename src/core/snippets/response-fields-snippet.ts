import { FieldDescriptor } from "../../types";
import { format } from "../utils/format";

/**
 * response-fields
 */
export function generateResponseFieldsSnippet(fields: FieldDescriptor[]): string {
    let fieldRows = "";

    fields.forEach((field) => {
        const optionalStr = field.optional ? "true" : "false";
        fieldRows += `\n| +${field.name}+ | +${field.type}+ | +${optionalStr}+ | ${field.description ?? ""}`;
    });

    return format`
= response-fields

== Response Fields
[cols="3,2,7", options="header"]
|===
| Field | Type | Optional | Description${fieldRows}
|===
`.trimStart();
}

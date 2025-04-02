import { FieldDescriptor } from "../../types";

/**
 * request-fields
 */
export function generateRequestFieldsSnippet(fields: FieldDescriptor[]): string {
    const lines: string[] = [];
    lines.push("= request-fields");
    lines.push("");
    lines.push("== Request Fields");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Field | Type | Optional | Description");

    fields.forEach((field) => {
        const isOptional = field.optional ? "true" : "false";
        lines.push(
            `| +${field.name}+ | +${field.type}+ | +${isOptional}+ | ${field.description ?? ""}`
        );
    });

    lines.push("|===");
    return lines.join("\n");
}

import { FieldDescriptor } from "../../types/descriptors";

/**
 * request-fields
 */
export function generateRequestFieldsSnippet(
    fields: FieldDescriptor[]
): string {
    const lines: string[] = [];
    lines.push("= request-fields");
    lines.push("");
    lines.push("== Request Fields");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Field | Optional | Description");

    fields.forEach((field) => {
        const isOptional = field.optional ? "true" : "false";
        lines.push(
            `| \`${field.name}\` | \`${isOptional}\` | ${
                field.description ?? ""
            }`
        );
    });

    lines.push("|===");
    return lines.join("\n");
}

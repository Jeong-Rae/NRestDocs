import { FieldDescriptor } from "../../types/descriptors";

/**
 * response-fields
 */
export function generateResponseFieldsSnippet(
    fields: FieldDescriptor[]
): string {
    const lines: string[] = [];
    lines.push("= response-fields");
    lines.push("");
    lines.push("== Response Fields");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Field | Type | Optional | Description");

    fields.forEach((field) => {
        const optionalStr = field.optional ? "true" : "false";
        lines.push(
            `| +${field.name}+ | +${field.type}+ | +${optionalStr}+ | ${
                field.description ?? ""
            }`
        );
    });

    lines.push("|===");
    return lines.join("\n");
}

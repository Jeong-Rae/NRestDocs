import { PartDescriptor } from "../../types";

/**
 * request-parts
 */
export function generateRequestPartsSnippet(parts: PartDescriptor[]): string {
    const lines: string[] = [];
    lines.push("= request-parts");
    lines.push("");
    lines.push("== Request Parts");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Name | Optional | Description");

    parts.forEach((part) => {
        const isOptional = part.optional ? "true" : "false";
        lines.push(`| +${part.name}+ | +${isOptional}+ | ${part.description ?? ""}`);
    });

    lines.push("|===");
    return lines.join("\n");
}

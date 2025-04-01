import { HeaderDescriptor } from "../../types/descriptors";

/**
 * request-headers
 */
export function generateRequestHeadersSnippet(
    headers: HeaderDescriptor[]
): string {
    const lines: string[] = [];
    lines.push("= request-headers");
    lines.push("");
    lines.push("== Request Headers");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Name | Optional | Description");

    headers.forEach((header) => {
        const isOptional = header.optional ? "true" : "false";
        lines.push(
            `| +${header.name}+ | +${isOptional}+ | ${header.description ?? ""}`
        );
    });

    lines.push("|===");

    return lines.join("\n");
}

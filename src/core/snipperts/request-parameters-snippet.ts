import { ParameterDescriptor } from "../../types/descriptors";

/**
 * request-parameters
 */
export function generateRequestParametersSnippet(
    params: ParameterDescriptor[]
): string {
    const lines: string[] = [];
    lines.push("= request-parameters");
    lines.push("");
    lines.push("== Request Parameters");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Name | Optional | Description");

    params.forEach((param) => {
        const isOptional = param.optional ? "true" : "false";
        lines.push(
            `| \`${param.name}\` | \`${isOptional}\` | ${
                param.description ?? ""
            }`
        );
    });

    lines.push("|===");
    return lines.join("\n");
}

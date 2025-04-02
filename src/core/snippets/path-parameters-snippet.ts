import { ParameterDescriptor } from "../../types";

/**
 * path-parameters
 */
export function generatePathParametersSnippet(params: ParameterDescriptor[]): string {
    const lines: string[] = [];
    lines.push("= path-parameters");
    lines.push("");
    lines.push("== Path Parameters");
    lines.push('[cols="3,2,7", options="header"]');
    lines.push("|===");
    lines.push("| Name | Optional | Description");

    params.forEach((param) => {
        const isOptional = param.optional ? "true" : "false";
        lines.push(`| +${param.name}+ | +${isOptional}+ | ${param.description ?? ""}`);
    });

    lines.push("|===");
    return lines.join("\n");
}

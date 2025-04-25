import { isEmpty } from "es-toolkit/compat";

import { format } from "@/utils/format";

import type { ParameterDescriptor } from "@/types";

/**
 * path-parameters
 */
export function generatePathParametersSnippet(params: ParameterDescriptor[]): string {
    if (isEmpty(params)) {
        return "";
    }

    let paramRows = "";

    params.forEach((param) => {
        const isOptional = param.optional ? "true" : "false";
        paramRows += `\n| +${param.name}+ | +${isOptional}+ | ${param.description ?? ""}`;
    });

    return format`
= path-parameters

== Path Parameters
[cols="3,2,7", options="header"]
|===
| Name | Optional | Description${paramRows}
|===
`.trimStart();
}

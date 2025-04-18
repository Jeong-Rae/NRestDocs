import { isEmpty } from "es-toolkit/compat";

import { format } from "../utils/format";

import type { ParameterDescriptor } from "../types";

/**
 * request-parameters
 */
export function generateRequestParametersSnippet(params: ParameterDescriptor[]): string {
    if (isEmpty(params)) {
        return "";
    }

    let paramRows = "";

    params.forEach((param) => {
        const isOptional = param.optional ? "true" : "false";
        paramRows += `\n| +${param.name}+ | +${isOptional}+ | ${param.description ?? ""}`;
    });

    return format`
= request-parameters

== Request Parameters
[cols="3,2,7", options="header"]
|===
| Name | Optional | Description${paramRows}
|===
`.trimStart();
}

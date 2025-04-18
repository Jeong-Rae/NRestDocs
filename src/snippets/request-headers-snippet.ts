import { isEmpty } from "es-toolkit/compat";

import { format } from "../utils/format";

import type { HeaderDescriptor } from "../types";

/**
 * request-headers
 */
export function generateRequestHeadersSnippet(headers: HeaderDescriptor[]): string {
    if (isEmpty(headers)) {
        return "";
    }

    let headerRows = "";

    headers.forEach((header) => {
        const isOptional = header.optional ? "true" : "false";
        headerRows += `\n| +${header.name}+ | +${isOptional}+ | ${header.description ?? ""}`;
    });

    return format`
= request-headers

== Request Headers
[cols="3,2,7", options="header"]
|===
| Name | Optional | Description${headerRows}
|===
`.trimStart();
}

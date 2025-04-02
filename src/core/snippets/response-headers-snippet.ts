import { isEmpty } from "es-toolkit/compat";

import { HeaderDescriptor } from "../../types";
import { format } from "../utils/format";

/**
 * response-headers
 */
export function generateResponseHeadersSnippet(headers: HeaderDescriptor[]): string {
    if (isEmpty(headers)) {
        return "";
    }

    let headerRows = "";

    headers.forEach((header) => {
        const isOptional = header.optional ? "true" : "false";
        headerRows += `\n| +${header.name}+ | +${isOptional}+ | ${header.description ?? ""}`;
    });

    return format`
= response-headers

== Response Headers
[cols="3,2,7", options="header"]
|===
| Name | Optional | Description${headerRows}
|===
`.trimStart();
}

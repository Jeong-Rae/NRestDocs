import { isEmpty } from "es-toolkit/compat";

import { PartDescriptor } from "../../types";
import { format } from "../utils/format";

/**
 * request-parts
 */
export function generateRequestPartsSnippet(parts: PartDescriptor[]): string {
    if (isEmpty(parts)) {
        return "";
    }

    let partRows = "";

    parts.forEach((part) => {
        const isOptional = part.optional ? "true" : "false";
        partRows += `\n| +${part.name}+ | +${isOptional}+ | ${part.description ?? ""}`;
    });

    return format`
= request-parts

== Request Parts
[cols="3,2,7", options="header"]
|===
| Name | Optional | Description${partRows}
|===
`.trimStart();
}

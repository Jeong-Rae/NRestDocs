import { format } from "@/utils/format";
import { filterResponseHeaders } from "@/utils/header-filter";

import type { HttpHeaders } from "@/types";

/**
 * http-response
 */
export function generateHttpResponseSnippet(
    statusCode: number,
    headers: HttpHeaders,
    body: unknown
): string {
    let headerLines = "";

    // headers
    for (const [key, value] of Object.entries(filterResponseHeaders(headers))) {
        headerLines += `\n${key}: ${value}`;
    }

    // body
    let bodyContent = "";
    if (body && Object.keys(body as Record<string, unknown>).length > 0) {
        bodyContent = `\n\n${JSON.stringify(body, null, 2)}`;
    }

    return format`
= http-response
[source]
----
HTTP/1.1 ${statusCode}${headerLines}${bodyContent}
----
`.trimStart();
}

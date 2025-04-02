import { HttpHeaders, HttpMethod } from "../../types";
import { format } from "../utils/format";
import { filterRequestHeaders } from "../utils/header-filter";

/**
 * http-request
 */
export function generateHttpRequestSnippet(
    method: HttpMethod,
    url: URL,
    headers: HttpHeaders,
    body: unknown
): string {
    let headerLines = `\nHost: ${url.host}`;

    // headers
    for (const [key, value] of Object.entries(filterRequestHeaders(headers))) {
        headerLines += `\n${key}: ${value}`;
    }

    // body
    let bodyContent = "";
    if (body && Object.keys(body as Record<string, unknown>).length > 0) {
        bodyContent = `\n\n${JSON.stringify(body, null, 2)}`;
    }

    return format`
= http-request
[source]
----
${method.toUpperCase()} ${url.pathname} HTTP/1.1${headerLines}${bodyContent}
----
`.trimStart();
}

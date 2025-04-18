import { format } from "../utils/format";
import { filterRequestHeaders } from "../utils/header-filter";

import type { HttpHeaders, HttpMethod } from "../types";

/**
 * curl-request
 */
export function generateCurlSnippet(
    method: HttpMethod,
    url: URL,
    headers: HttpHeaders,
    body: unknown
): string {
    // curl command 시작
    let curlCmd = `curl -X ${method.toUpperCase()} "${url.toString()}"`;

    // headers 추가
    Object.entries(filterRequestHeaders(headers)).forEach(([key, value]) => {
        curlCmd += ` \\\n  -H "${key}: ${value}"`;
    });

    // body 추가
    if (body && Object.keys(body as Record<string, unknown>).length > 0) {
        const jsonBody = JSON.stringify(body).replace(/"/g, '\\"');
        curlCmd += ` \\\n  -d "${jsonBody}"`;
    }

    return format`
= curl-request
[source,bash]
----
${curlCmd}
----
`.trimStart();
}

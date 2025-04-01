import { HttpHeaders, HttpMethod } from "../../types/http";
import { filterRequestHeaders } from "../utils/header-filter";

/**
 * curl-request
 */
export function generateCurlSnippet(
    method: HttpMethod,
    url: URL,
    headers: HttpHeaders,
    body: any
): string {
    const lines: string[] = [];

    lines.push("= curl-request");
    lines.push("[source,bash]");
    lines.push("----");

    // curl command
    let curlCmd = `curl -X ${method.toUpperCase()} "${url.toString()}"`;

    // headers
    Object.entries(filterRequestHeaders(headers)).forEach(([key, value]) => {
        curlCmd += ` \\\n  -H "${key}: ${value}"`;
    });

    // body
    if (body && Object.keys(body).length > 0) {
        const jsonBody = JSON.stringify(body).replace(/"/g, '\\"');
        curlCmd += ` \\\n  -d "${jsonBody}"`;
    }

    lines.push(curlCmd);
    lines.push("----");

    return lines.join("\n");
}

import { HttpHeaders, HttpMethod } from "../../types";
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
    const lines: string[] = [];

    lines.push("= http-request");
    lines.push("[source]");
    lines.push("----");
    lines.push(`${method.toUpperCase()} ${url.pathname} HTTP/1.1`);
    lines.push(`Host: ${url.host}`);

    // headers
    for (const [key, value] of Object.entries(filterRequestHeaders(headers))) {
        lines.push(`${key}: ${value}`);
    }

    lines.push("");

    // body
    if (body && Object.keys(body as Record<string, unknown>).length > 0) {
        lines.push(JSON.stringify(body, null, 2));
    }

    lines.push("----");
    return lines.join("\n");
}

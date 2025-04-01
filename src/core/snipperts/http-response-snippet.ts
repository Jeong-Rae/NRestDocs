import { HttpHeaders } from "../../types/http";
import { filterResponseHeaders } from "../utils/header-filter";

/**
 * http-response
 */
export function generateHttpResponseSnippet(
    statusCode: number,
    headers: HttpHeaders,
    body: any
): string {
    const lines: string[] = [];

    lines.push("= http-response");
    lines.push("[source]");
    lines.push("----");
    lines.push(`HTTP/1.1 ${statusCode}`);

    // headers
    for (const [key, value] of Object.entries(filterResponseHeaders(headers))) {
        lines.push(`${key}: ${value}`);
    }

    lines.push("");

    // body
    if (body && Object.keys(body).length > 0) {
        lines.push(JSON.stringify(body, null, 2));
    }

    lines.push("----");
    return lines.join("\n");
}

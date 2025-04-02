import { HttpMethod } from "../../types";
import { format } from "../utils/format";

/** API 제목 스니펫 */
export function snippetTitle(identifier: string): string {
    return format`
= API: ${identifier}
`.trimStart();
}

/** Overview 스니펫 */
export function snippetOverview(method: HttpMethod, path: string): string {
    return format`
== Overview
HTTP Method:: \`${method}\`
URL Path:: \`${path}\`
`.trimStart();
}

/** Request 스니펫 */
export function snippetRequestBlock(json: unknown): string {
    return format`
== Request
[source,json]
----
${JSON.stringify(json, null, 2)}
----
`.trimStart();
}

/** Response 스니펫 */
export function snippetResponseBlock(json: unknown): string {
    return format`
== Response
[source,json]
----
${JSON.stringify(json, null, 2)}
----
`.trimStart();
}

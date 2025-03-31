import { format } from "../../utils/format";

export function renderTitle(identifier: string): string {
    return format`
= API: ${identifier}
`;
}

export function renderOverview(method: string, path: string): string {
    return format`
== Overview
HTTP Method:: \`${method}\`
URL Path:: \`${path}\`
`;
}

export function renderRequestBlock(json: any): string {
    return format`
== Request
[source,json]
----
${JSON.stringify(json, null, 2)}
----
`;
}

export function renderResponseBlock(json: any): string {
    return format`
== Response
[source,json]
----
${JSON.stringify(json, null, 2)}
----
`;
}

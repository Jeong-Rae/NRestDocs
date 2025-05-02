import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { filterRequestHeaders } from "@/utils/header-filter";
import { isEmpty, toPairs } from "es-toolkit/compat";

export type HttpRequestSnippetContext = {
    method: string;
    path: string;
    headers: { name: string; value: string }[];
    body: string;
};

export function buildHttpRequestContext(snapshot: DocumentSnapshot): HttpRequestSnippetContext {
    const { method, url, requestBody, requestHeaders } = snapshot.http;

    const headers = toPairs(filterRequestHeaders(requestHeaders)).map(([name, value]) => ({
        name,
        value,
    }));

    return {
        method,
        path: url.pathname,
        headers,
        body: isEmpty(requestBody) ? "" : `${formatJson(requestBody)}\n`,
    };
}

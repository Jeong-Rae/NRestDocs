import { STATUS_CODES } from "node:http";
import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { filterResponseHeaders } from "@/utils/header-filter";
import { isEmpty, toPairs } from "es-toolkit/compat";

export type HttpResponseSnippetContext = {
    statusCode: number;
    statusReason: string;
    headers: { name: string; value: string }[];
    body: string;
};

export function buildHttpResponseContext(snapshot: DocumentSnapshot): HttpResponseSnippetContext {
    const { statusCode, responseBody, responseHeaders } = snapshot.http;

    const headers = toPairs(filterResponseHeaders(responseHeaders)).map(([name, value]) => ({
        name,
        value,
    }));

    return {
        statusCode,
        statusReason: STATUS_CODES[statusCode] ?? "",
        headers,
        body: isEmpty(responseBody) ? "" : `${formatJson(responseBody)}\n`,
    };
}

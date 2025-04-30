import type { HttpBody, HttpCookies, HttpHeaders, HttpMethod, HttpQuery } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { MissingFieldError } from "@/errors";
import { compact, isEmpty, join, toPairs } from "es-toolkit/compat";

export type CurlSnippetContext = {
    method: string;
    url: string;
    options: string;
};

export function buildCurlContext(snapshot: DocumentSnapshot): CurlSnippetContext {
    const { method, url, requestHeaders, requestCookies, requestQuery, requestBody } =
        snapshot.http;

    if (!method) {
        throw new MissingFieldError("method is undefined");
    }
    if (!url) {
        throw new MissingFieldError("url is undefined");
    }

    const finalUrl = buildUrl(url, requestQuery);

    const options = compact([
        buildMethodOption(method),
        ...buildHeaderOptions(requestHeaders),
        buildCookieOption(requestCookies),
        buildBodyOption(requestBody),
    ]);

    return {
        method: method.toUpperCase(),
        url: finalUrl.toString(),
        options: join(options, " ") + "\n",
    };
}

function buildUrl(baseUrl: URL, query?: HttpQuery): URL {
    const finalUrl = new URL(baseUrl.toString());
    if (!isEmpty(query)) {
        toPairs(query).forEach(([key, value]) => {
            finalUrl.searchParams.append(key, String(value));
        });
    }
    return finalUrl;
}

function buildMethodOption(method: HttpMethod): string {
    return `-X ${method.toUpperCase()}`;
}

function buildHeaderOptions(headers?: HttpHeaders): string[] {
    if (isEmpty(headers)) {
        return [];
    }
    return toPairs(headers).map(([key, value]) => `-H "${key}: ${value}"`);
}

function buildCookieOption(cookies?: HttpCookies): string {
    if (isEmpty(cookies)) {
        return "";
    }
    return `--cookie "${cookies}"`;
}

function buildBodyOption(body?: HttpBody): string {
    if (isEmpty(body)) {
        return "";
    }
    const jsonBody = JSON.stringify(body).replace(/"/g, '\\"');
    return `-d "${jsonBody}"`;
}

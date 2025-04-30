import type { DocumentSnapshot } from "@/builders";
import { isEmpty, merge, some, toPairs, values } from "es-toolkit/compat";

type Header = {
    name: string;
    type: string;
    description: string;
    format?: string;
    optional?: boolean;
};

export type RequestHeadersSnippetContext = {
    headers: Header[];
    hasFormat: boolean;
    hasOptional: boolean;
};

export function buildRequestHeadersContext(
    snapshot: DocumentSnapshot
): RequestHeadersSnippetContext {
    const { requestHeaders } = snapshot.http;
    const { request } = snapshot.headers;

    if (isEmpty(requestHeaders) && isEmpty(request)) {
        return {
            headers: [],
            hasFormat: false,
            hasOptional: false,
        };
    }

    const headerValueFields = toPairs(requestHeaders).reduce<Record<string, Header>>(
        (acc, [key, value]) => {
            acc[key] = {
                name: key,
                type: "string",
                description: "",
            };
            return acc;
        },
        {}
    );

    const headerDescriptorFields = request.reduce<Record<string, Header>>((acc, field) => {
        acc[field.name] = {
            name: field.name,
            type: field.type,
            description: field.description ?? "",
            format: field.format,
            optional: field.optional,
        };
        return acc;
    }, {});

    const mergedFields = merge(headerValueFields, headerDescriptorFields);
    const headers = values(mergedFields);

    const hasFormat = some(headers, (field) => Boolean(field.format));
    const hasOptional = some(headers, (field) => Boolean(field.optional));

    return {
        headers,
        hasFormat,
        hasOptional,
    };
}

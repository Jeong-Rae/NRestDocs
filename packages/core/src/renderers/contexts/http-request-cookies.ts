import type { DocumentSnapshot } from "@/builders";
import { fromPairs, isEmpty, merge, some, split, toPairs, trim, values } from "es-toolkit/compat";

type Cookie = {
    name: string;
    type: string;
    description: string;
    optional?: boolean;
};

export type HttpRequestCookiesSnippetContext = {
    cookies: Cookie[];
    hasOptional: boolean;
};

export function buildHttpRequestCookiesContext(
    snapshot: DocumentSnapshot
): HttpRequestCookiesSnippetContext {
    const { requestCookies } = snapshot.http;
    const { request } = snapshot.cookies;

    const cookiePairs = split(requestCookies, ";")
        .map((pair) => {
            const [rawKey, rawValue] = split(pair, "=");
            if (!isEmpty(rawValue)) {
                try {
                    const key = decodeURIComponent(trim(rawKey));
                    const value = decodeURIComponent(trim(rawValue));
                    return [key, value];
                } catch {
                    return null;
                }
            }
            return null;
        })
        .filter(Boolean) as [string, string][];

    const cookieMap = fromPairs(cookiePairs);

    const cookieValueFields = toPairs(cookieMap).reduce<Record<string, Cookie>>((acc, [key]) => {
        acc[key] = {
            name: key,
            type: "string",
            description: "",
        };
        return acc;
    }, {});

    const requestFields = request.reduce<Record<string, Cookie>>((acc, cookie) => {
        acc[cookie.name] = {
            ...cookie,
            description: cookie.description ?? "",
        };
        return acc;
    }, {});

    const mergedFields = merge(cookieValueFields, requestFields);
    const cookies = values(mergedFields);

    const hasOptional = some(cookies, (field) => Boolean(field.optional));

    return {
        cookies,
        hasOptional,
    };
}

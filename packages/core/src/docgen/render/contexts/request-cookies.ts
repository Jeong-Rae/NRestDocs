import type { DocumentSnapshot } from "@/docgen/builders";
import { fromPairs, isEmpty, merge, some, split, toPairs, trim, values } from "es-toolkit/compat";
import type { Context } from "./context.type.";
type Cookie = {
    name: string;
    type: string;
    description: string;
    optional?: boolean;
};

export type RequestCookiesSnippetContext = {
    cookies: Cookie[];
    hasOptional: boolean;
};

export function buildRequestCookiesContext(
    snapshot: DocumentSnapshot
): Context<RequestCookiesSnippetContext> {
    const { requestCookies } = snapshot.http;
    const { request } = snapshot.cookies;

    if (isEmpty(request)) {
        return {
            context: {
                cookies: [],
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

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
        context: {
            cookies,
            hasOptional,
        },
        isEmpty: false,
    };
}

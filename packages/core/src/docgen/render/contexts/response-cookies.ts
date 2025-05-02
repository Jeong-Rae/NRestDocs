import type { DocumentSnapshot } from "@/docgen/builders";
import { fromPairs, isEmpty, merge, some, split, toPairs, trim, values } from "es-toolkit/compat";
import type { Context } from "./context.type";
type Cookie = {
    name: string;
    type: string;
    description: string;
    optional?: boolean;
};

export type ResponseCookiesSnippetContext = {
    cookies: Cookie[];
    hasOptional: boolean;
};

export function buildResponseCookiesContext(
    snapshot: DocumentSnapshot
): Context<ResponseCookiesSnippetContext> {
    const { responseCookies } = snapshot.http;
    const { response } = snapshot.cookies;

    if (isEmpty(response)) {
        return {
            context: {
                cookies: [],
                hasOptional: false,
            },
            isEmpty: true,
        };
    }

    const cookiePairs = split(responseCookies, ";")
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

    const responseFields = response.reduce<Record<string, Cookie>>((acc, cookie) => {
        acc[cookie.name] = {
            ...cookie,
            description: cookie.description ?? "",
        };
        return acc;
    }, {});

    const mergedFields = merge(cookieValueFields, responseFields);
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

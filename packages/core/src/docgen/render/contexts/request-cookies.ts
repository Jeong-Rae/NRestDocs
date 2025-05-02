import type { CookieDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type";

export type RequestCookiesSnippetContext = {
    cookies: CookieDescriptor[];
    hasOptional: boolean;
};

export function buildRequestCookiesContext(
    snapshot: DocumentSnapshot
): Context<RequestCookiesSnippetContext> {
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

    const hasOptional = some(request, (field) => Boolean(field.optional));

    return {
        context: {
            cookies: request,
            hasOptional,
        },
        isEmpty: false,
    };
}

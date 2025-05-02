import type { CookieDescriptor } from "@/core";
import type { DocumentSnapshot } from "@/docgen/builders";
import { isEmpty, some } from "es-toolkit/compat";
import type { Context } from "./context.type";

export type ResponseCookiesSnippetContext = {
    cookies: CookieDescriptor[];
    hasOptional: boolean;
};

export function buildResponseCookiesContext(
    snapshot: DocumentSnapshot
): Context<ResponseCookiesSnippetContext> {
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

    const hasOptional = some(response, (field) => Boolean(field.optional));

    return {
        context: {
            cookies: response,
            hasOptional,
        },
        isEmpty: false,
    };
}

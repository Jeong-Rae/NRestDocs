import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { isEmpty } from "es-toolkit/compat";
import type { Context } from "./context.type";
export type ResponseBodySnippetContext = {
    language: string;
    body: string;
};

export function buildResponseBodyContext(
    snapshot: DocumentSnapshot
): Context<ResponseBodySnippetContext> {
    const { responseBody } = snapshot.http;
    if (isEmpty(responseBody)) {
        return {
            context: {
                language: "json",
                body: "",
            },
            isEmpty: true,
        };
    }
    return {
        context: {
            language: "json",
            body: `${formatJson(responseBody)}`,
        },
        isEmpty: false,
    };
}

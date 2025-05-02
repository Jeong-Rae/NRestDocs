import type { DocumentSnapshot } from "@/docgen/builders";
import { formatJson } from "@/utils/format";
import { isEmpty } from "es-toolkit/compat";
import type { Context } from "./context.type.";

export type RequestBodySnippetContext = {
    language: string;
    body: string;
};

export function buildRequestBodyContext(
    snapshot: DocumentSnapshot
): Context<RequestBodySnippetContext> {
    const { requestBody } = snapshot.http;

    if (isEmpty(requestBody)) {
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
            body: `${formatJson(requestBody)}`,
        },
        isEmpty: false,
    };
}

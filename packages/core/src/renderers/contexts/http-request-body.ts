import type { DocumentSnapshot } from "@/builders";
import { isEmpty } from "es-toolkit/compat";

export type HttpRequestBodySnippetContext = {
    body: string;
};

export function buildHttpRequestBodyContext(
    snapshot: DocumentSnapshot
): HttpRequestBodySnippetContext {
    const { requestBody } = snapshot.http;
    if (isEmpty(requestBody)) {
        return {
            body: "\n",
        };
    }
    return {
        body: JSON.stringify(requestBody, null, 2) + "\n",
    };
}
